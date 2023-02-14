# Open-Smartwatch Web

![preview](docs/main.png)

This project is the web interface for the open-smartwatch. it connects to the OS using its built-in API and allows you to configure the watch.

## Development
You want to fix something? Just start the development server and start hacking!

```bash
npm install # Install dependencies, only needed once
npm start
```

## Build
If you want to build the project, just run the build script. It will create a `dist` folder with the compiled files.

```bash
npm run build-osw
```

You should then be able to drop-in-replace the respective source-codes in the osw-os repository.

### The `dist` branch...
... is a special branch that contains the compiled files. It is used to provide the compiled files to the OSW-OS repository. As a maintainer you have to update the `dist` branch manually. You can use the `update-dist-branch.sh` script for that.