```zch
npm init -y
```

```zch
npm i express
```

```zch
npm i -D typescript ts-node-dev @types/express @types/node
```

Добавили скрипты в package.json

```json
"dev": "ts-node-dev src/index.ts",
"build": "tsc",
"start": "node dist/index.js",
```

Добавили файл tsconfig.json

```zsh
npx tsc --init
```

Изменили tsconfig.json

```json
{
  // Visit https://aka.ms/tsconfig to read more about this file
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",

    // Environment Settings
    // See also https://aka.ms/tsconfig/module
    "module": "commonjs",
    "target": "es2020",
    "lib": ["ES2020"],
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipDefaultLibCheck": true,
    "resolveJsonModule": true,
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```