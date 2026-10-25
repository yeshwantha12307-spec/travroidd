import fs from 'fs';
import readline from 'readline';

async function scan() {
  const filePath = 'C:\\Users\\sunil\\.gemini\\antigravity-ide\\brain\\2c227083-1d9a-49be-b0c4-c77f123fd4ad\\.system_generated\\logs\\transcript.jsonl';
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let lineNo = 0;
  for await (const line of rl) {
    lineNo++;
    try {
      const data = JSON.parse(line);
      if (data.type === 'USER_INPUT') {
        const text = data.content || '';
        console.log(`--- USER_INPUT at line ${lineNo} (step ${data.step_index}) ---`);
        console.log(text.slice(0, 200).replace(/\n/g, ' '));
        const mediaMatches = line.match(/media_[0-9]+\.(png|jpg|jpeg|webp)/g);
        if (mediaMatches) {
          console.log('Media in this turn:', [...new Set(mediaMatches)]);
        }
      }
    } catch (e) {}
  }
}

scan();
