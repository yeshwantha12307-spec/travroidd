import React, { useState } from 'react';
import { Lock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';
import { Input, Label } from './ui/Input';
import { toast } from 'sonner';

import { extractErrorMessage } from '../lib/errorUtils';

export const AdminChangePasswordModal: React.FC = () => {
  const { user, changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!user || !user.must_change_password) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match');
      return;
    }

    setSubmitting(true);
    try {
      const res = await changePassword(currentPassword, newPassword);
      if (res.error) {
        toast.error(extractErrorMessage(res.error, 'Failed to update password'));
      } else {
        toast.success('Admin password updated successfully!');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-amber-200">
        <div className="flex items-center gap-3 text-amber-600">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Mandatory Password Change</h2>
            <p className="text-xs text-slate-500">First-time administrator login requirement</p>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-600 leading-relaxed">
          For security reasons, the initial administrative password must be replaced with a secure personal password before continuing.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <Label htmlFor="current-admin-pass">Current / Initial Password</Label>
            <Input
              id="current-admin-pass"
              type="password"
              required
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="new-admin-pass">New Password (min 8 chars, mixed letters & numbers)</Label>
            <Input
              id="new-admin-pass"
              type="password"
              required
              placeholder="••••••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="confirm-admin-pass">Confirm New Password</Label>
            <Input
              id="confirm-admin-pass"
              type="password"
              required
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1"
            />
          </div>

          <Button type="submit" className="w-full gap-2 mt-2" disabled={submitting}>
            <Lock className="h-4 w-4" />
            {submitting ? 'Updating...' : 'Set Secure Password & Proceed'}
          </Button>
        </form>
      </div>
    </div>
  );
};
