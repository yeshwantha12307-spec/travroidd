import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit3, MessageCircle, Phone, RefreshCw } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/ui/Button';
import { Input, Textarea, Label } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import type { Destination } from '../data/destinations';
import { formatINR } from '../data/destinations';
import { toast } from 'sonner';

export const AdminPage: React.FC = () => {
  const { user, isAdmin, signIn } = useAuth();
  const {
    bookings,
    enquiries,
    destinations,
    updateBookingStatus,
    deleteBooking,
    updateDestination,
    addDestination,
    deleteDestination,
    getDestination,
  } = useBookings();

  const [activeTab, setActiveTab] = useState<'bookings' | 'destinations' | 'enquiries'>('bookings');
  const [editingDest, setEditingDest] = useState<Destination | null>(null);
  const [isAddingDest, setIsAddingDest] = useState(false);

  // New destination form state
  const [newDest, setNewDest] = useState<Partial<Destination>>({
    slug: '',
    name: '',
    region: 'North India',
    price: 6999,
    duration: '3 Nights / 4 Days',
    tagline: '',
    image: '/assets/destinations/Kashmir/VQN2w2Z.jpg',
    description: '',
    highlights: ['Scenic sightseeing', 'Local culture tour', 'Comfort stay'],
    itinerary: [
      { day: 'Day 1', title: 'Arrival & Check-in', detail: 'Welcome and leisure evening.' },
      { day: 'Day 2', title: 'Full Day Sightseeing', detail: 'Explore major highlights and local cuisine.' },
    ],
  });

  const handleQuickAdminLogin = async () => {
    const res = await signIn('admin@travroidd.com', 'admin123');
    if (res.error) toast.error(res.error.message);
    else toast.success('Signed in as Admin!');
  };

  if (!isAdmin) {
    return (
      <section className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Access denied</h1>
        <p className="mt-2 text-muted-foreground">
          This area is for authorised Travroidd admins only.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Button onClick={handleQuickAdminLogin} className="w-full">
            Log in as Admin (admin@travroidd.com)
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Go home</Link>
          </Button>
        </div>
      </section>
    );
  }

  const totalBookings = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedValue = bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.total_amount, 0);

  const handleStatusChange = (id: string, status: 'confirmed' | 'cancelled') => {
    updateBookingStatus(id, status);
    toast.success(`Marked ${status}`);
  };

  const handleSaveDest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDest) return;
    updateDestination(editingDest);
    setEditingDest(null);
    toast.success(`Updated ${editingDest.name} package!`);
  };

  const handleCreateDest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDest.name || !newDest.slug) {
      toast.error('Name and slug are required');
      return;
    }
    const slug = newDest.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    addDestination({
      slug,
      name: newDest.name,
      title: `${newDest.name} – Tour Package`,
      category: 'Hills',
      state: newDest.region || 'North India',
      region: newDest.region || 'North India',
      price: Number(newDest.price) || 5999,
      duration: newDest.duration || '3 Nights / 4 Days',
      tagline: newDest.tagline || 'Experience the wonder',
      image: newDest.image || '/assets/kashmir-CYJeKKxI.jpg',
      galleryImages: [newDest.image || '/assets/kashmir-CYJeKKxI.jpg'],
      description: newDest.description || 'An unforgettable experience.',
      highlights: newDest.highlights || ['Sightseeing', 'Hotel stay'],
      itinerary: newDest.itinerary || [
        { day: 'Day 1', title: 'Arrival', detail: 'Check-in and relax.' },
      ],
    });
    setIsAddingDest(false);
    toast.success(`Added new destination: ${newDest.name}`);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Signed in as <span className="font-semibold text-primary">{user?.email}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'bookings' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('bookings')}
          >
            Bookings ({bookings.length})
          </Button>
          <Button
            variant={activeTab === 'destinations' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('destinations')}
          >
            Destinations ({destinations.length})
          </Button>
          <Button
            variant={activeTab === 'enquiries' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('enquiries')}
          >
            Enquiries ({enquiries.length})
          </Button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          ['Total bookings', totalBookings],
          ['Pending', pendingCount],
          ['Confirmed value', formatINR(confirmedValue)],
        ].map(([title, val]) => (
          <div key={title} className="rounded-2xl bg-card p-5 shadow-card">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-primary">{val}</p>
          </div>
        ))}
      </div>

      {/* Tab 1: Bookings Management */}
      {activeTab === 'bookings' && (
        <div className="mt-8 overflow-x-auto rounded-2xl border bg-card shadow-card">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-secondary text-left">
              <tr>
                {[
                  'Date',
                  'Customer',
                  'Contact',
                  'Destination',
                  'Travel',
                  'Pax',
                  'Total',
                  'Notes',
                  'Status',
                  'Actions',
                ].map((th) => (
                  <th key={th} className="p-3 font-semibold">
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const dest = getDestination(b.destination);
                return (
                  <tr key={b.id} className="border-t align-top">
                    <td className="p-3">
                      {new Date(b.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="p-3 font-medium">{b.full_name}</td>
                    <td className="p-3">
                      <a href={`tel:${b.phone}`} className="text-primary hover:underline">
                        {b.phone}
                      </a>
                      <br />
                      <span className="text-muted-foreground text-xs">{b.email}</span>
                    </td>
                    <td className="p-3 font-medium">{dest?.name || b.destination}</td>
                    <td className="p-3">{b.travel_date}</td>
                    <td className="p-3">{b.travelers}</td>
                    <td className="p-3 font-semibold">{formatINR(b.total_amount)}</td>
                    <td className="max-w-[200px] p-3 text-muted-foreground text-xs">
                      {b.notes || '—'}
                    </td>
                    <td className="p-3">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="space-x-1 whitespace-nowrap p-3">
                      {b.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(b.id, 'confirmed')}
                          >
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(b.id, 'cancelled')}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {b.status !== 'pending' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStatusChange(b.id, 'pending' as any)}
                          title="Reset to pending"
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          if (confirm('Delete this booking?')) {
                            deleteBooking(b.id);
                            toast.success('Booking deleted');
                          }
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {!bookings.length && (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-muted-foreground">
                    No bookings yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Destinations & Packages Management */}
      {activeTab === 'destinations' && (
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Manage Packages & Destinations</h2>
            <Button
              size="sm"
              onClick={() => {
                setIsAddingDest(true);
                setEditingDest(null);
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" /> Add Destination
            </Button>
          </div>

          {/* Add Form */}
          {isAddingDest && (
            <form
              onSubmit={handleCreateDest}
              className="rounded-2xl border bg-card p-6 shadow-card space-y-4"
            >
              <h3 className="text-lg font-bold">Add New Destination</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Destination Name</Label>
                  <Input
                    required
                    value={newDest.name || ''}
                    onChange={(e) =>
                      setNewDest({
                        ...newDest,
                        name: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                      })
                    }
                    placeholder="e.g. Ooty"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Slug</Label>
                  <Input
                    required
                    value={newDest.slug || ''}
                    onChange={(e) => setNewDest({ ...newDest, slug: e.target.value })}
                    placeholder="e.g. ooty"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Region</Label>
                  <Input
                    required
                    value={newDest.region || ''}
                    onChange={(e) => setNewDest({ ...newDest, region: e.target.value })}
                    placeholder="e.g. Tamil Nadu"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Starting Price (₹)</Label>
                  <Input
                    type="number"
                    required
                    value={newDest.price || ''}
                    onChange={(e) => setNewDest({ ...newDest, price: Number(e.target.value) })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Duration</Label>
                  <Input
                    required
                    value={newDest.duration || ''}
                    onChange={(e) => setNewDest({ ...newDest, duration: e.target.value })}
                    placeholder="3 Nights / 4 Days"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Photo / Image URL</Label>
                  <Input
                    required
                    value={newDest.image || ''}
                    onChange={(e) => setNewDest({ ...newDest, image: e.target.value })}
                    placeholder="/assets/kashmir-CYJeKKxI.jpg"
                    className="mt-2"
                  />
                </div>
              </div>
              <div>
                <Label>Tagline</Label>
                <Input
                  required
                  value={newDest.tagline || ''}
                  onChange={(e) => setNewDest({ ...newDest, tagline: e.target.value })}
                  placeholder="Queen of Nilgiri hill stations"
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  required
                  value={newDest.description || ''}
                  onChange={(e) => setNewDest({ ...newDest, description: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Create Destination</Button>
                <Button variant="outline" type="button" onClick={() => setIsAddingDest(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {/* Edit Form */}
          {editingDest && (
            <form
              onSubmit={handleSaveDest}
              className="rounded-2xl border bg-card p-6 shadow-card space-y-4"
            >
              <h3 className="text-lg font-bold">Edit Package: {editingDest.name}</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Package Name</Label>
                  <Input
                    value={editingDest.name}
                    onChange={(e) => setEditingDest({ ...editingDest, name: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Region</Label>
                  <Input
                    value={editingDest.region}
                    onChange={(e) => setEditingDest({ ...editingDest, region: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Starting Price (₹)</Label>
                  <Input
                    type="number"
                    value={editingDest.price}
                    onChange={(e) =>
                      setEditingDest({ ...editingDest, price: Number(e.target.value) })
                    }
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Duration</Label>
                  <Input
                    value={editingDest.duration}
                    onChange={(e) => setEditingDest({ ...editingDest, duration: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Photo / Image URL</Label>
                  <Input
                    value={editingDest.image}
                    onChange={(e) => setEditingDest({ ...editingDest, image: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Tagline</Label>
                  <Input
                    value={editingDest.tagline}
                    onChange={(e) => setEditingDest({ ...editingDest, tagline: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={editingDest.description}
                  onChange={(e) =>
                    setEditingDest({ ...editingDest, description: e.target.value })
                  }
                  className="mt-2"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Save Changes</Button>
                <Button variant="outline" type="button" onClick={() => setEditingDest(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {/* Destinations Table */}
          <div className="overflow-x-auto rounded-2xl border bg-card shadow-card">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="bg-secondary text-left">
                <tr>
                  <th className="p-3">Photo</th>
                  <th className="p-3">Destination</th>
                  <th className="p-3">Region</th>
                  <th className="p-3">Price / Person</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {destinations.map((d) => (
                  <tr key={d.slug} className="border-t">
                    <td className="p-3">
                      <img
                        src={d.image}
                        alt={d.name}
                        className="h-12 w-16 rounded-lg object-cover"
                      />
                    </td>
                    <td className="p-3 font-semibold">{d.name}</td>
                    <td className="p-3">{d.region}</td>
                    <td className="p-3 font-bold text-primary">{formatINR(d.price)}</td>
                    <td className="p-3">{d.duration}</td>
                    <td className="p-3 space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingDest(d);
                          setIsAddingDest(false);
                        }}
                      >
                        <Edit3 className="h-3 w-3 mr-1" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          if (confirm(`Delete destination ${d.name}?`)) {
                            deleteDestination(d.slug);
                            toast.success(`Deleted ${d.name}`);
                          }
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Enquiries Management */}
      {activeTab === 'enquiries' && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-bold">Customer Enquiries</h2>
          {enquiries.length === 0 ? (
            <div className="rounded-2xl border bg-card p-8 text-center text-muted-foreground shadow-card">
              No enquiries submitted yet.
            </div>
          ) : (
            <div className="space-y-4">
              {enquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="rounded-2xl border bg-card p-6 shadow-card flex flex-wrap items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{enq.name}</h3>
                      <span className="text-xs text-muted-foreground">
                        {new Date(enq.created_at).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Email: <a href={`mailto:${enq.email}`} className="text-primary hover:underline">{enq.email}</a>
                      {enq.phone && (
                        <span> · Phone: <a href={`tel:${enq.phone}`} className="text-primary hover:underline">{enq.phone}</a></span>
                      )}
                    </p>
                    <p className="mt-3 text-sm bg-secondary/50 p-3 rounded-lg">
                      "{enq.message}"
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {enq.phone && (
                      <Button asChild size="sm" variant="outline">
                        <a
                          href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hi ${enq.name}, thank you for contacting Travroidd! Regarding your enquiry:`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <MessageCircle className="h-3.5 w-3.5 mr-1 text-whatsapp" /> WhatsApp
                        </a>
                      </Button>
                    )}
                    <Button asChild size="sm">
                      <a href={`tel:${enq.phone || '+917339111948'}`}>
                        <Phone className="h-3.5 w-3.5 mr-1" /> Call
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
