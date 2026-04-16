import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function convertFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const relativePath = path.relative('src', filePath);
    const outputDir = path.join('rn-converted', path.dirname(relativePath));
    const outputPath = path.join(outputDir, path.basename(filePath, path.extname(filePath)) + '.native.tsx');

    // Ensure output dir exists
    await fs.mkdir(outputDir, { recursive: true });

    const prompt = `Convert this React Web (Tailwind CSS) component to React Native (Expo compatible) .tsx component.

Rules:
- UI: div → View, p/span/h1-h6 → Text, img → Image, button → TouchableOpacity/Button
- Styling: Convert Tailwind className to StyleSheet.create({}). Use exact RN styles (flex:1 → flex: 1, p-4 → padding: 16, text-xl → fontSize: 20, etc.). Use pixels (1rem=16px).
- Icons: Fa* → from '@expo/vector-icons/fa' or similar expo icons.
- Preserve ALL logic, state (useState/useEffect), utils imports, props, functions, API calls.
- Web-specific: Remove DOM refs, replace window/localStorage if needed (AsyncStorage), MediaRecorder → expo-av later.
- Imports: Add 'react-native' imports (View, Text, StyleSheet, etc.), remove react-dom.
- Router: Preserve react-router-dom for now (replace with expo-router manually later).
- Output COMPLETE valid RN component with React.FC<Props> if possible.
- Make mobile-responsive (flex, Dimensions if needed).

Original file: ${path.basename(filePath)}
Code:
\`\`\`jsx
${content}
\`\`\`

Respond ONLY with the full converted .tsx code, no explanations.`;

    console.log(`🔄 Converting: ${relativePath}`);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert React Native developer specializing in Web to RN conversions. Follow rules precisely. Output only valid RN code.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.1,
      max_tokens: 16000,
    });

    const convertedCode = completion.choices[0].message.content.trim();

    // Basic validation: check if starts with import and ends with export
    if (!convertedCode.includes('import') || !convertedCode.includes('export')) {
      console.warn(`⚠️  Invalid output for ${relativePath}, skipping...`);
      return;
    }

    await fs.writeFile(outputPath, convertedCode);
    console.log(`✅ Saved: rn-converted/${relativePath.replace(/\\|\//g, '/')}.native.tsx`);
  } catch (error) {
    console.error(`❌ Error converting ${filePath}:`, error.message);
  }
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Set OPENAI_API_KEY=sk-...');
    process.exit(1);
  }

  console.log('🚀 Starting React → React Native conversion...');
  const files = await glob('src/**/*.{jsx,js}', { ignore: ['src/utils/**', 'src/context/**'] }); // Skip utils/contexts initially

  console.log(`Found ${files.length} files to convert.`);

  // Process in batches of 5
  for (let i = 0; i < files.length; i += 5) {
    const batch = files.slice(i, i + 5);
    await Promise.all(batch.map(convertFile));
    console.log(`⏳ Batch ${Math.floor(i/5) + 1}/${Math.ceil(files.length/5)} complete.`);
  }

  console.log('🎉 Conversion complete! Check rn-converted/ folder.');
  console.log('\nNext steps:\n1. npx create-expo-app@latest AsthmaRN --template blank-typescript\n2. cd AsthmaRN && yarn add nativewind react-native-reanimated @expo/vector-icons expo-av expo-location\n3. Copy rn-converted/** to app/\n4. Update app.json, babel.config.js for NativeWind/Reanimated\n5. npx expo start\n');
}

main().catch(console.error);

