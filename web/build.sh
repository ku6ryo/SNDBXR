
cp ./src/ConnectorBase.js ../Unity/Build
cp ./src/ConnectorUnity.js ../Unity/Build
cp ./src/main.js ../Unity/Build
cp ./src/style.css ../Unity/Build

echo '<script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js"></script>' >> ../Unity/Build/index.html
echo '<script src="./ConnectorBase.js"></script>' >> ../Unity/Build/index.html
echo '<script src="./ConnectorUnity.js"></script>' >> ../Unity/Build/index.html
echo '<script src="./main.js"></script>' >> ../Unity/Build/index.html
echo '<link rel="stylesheet" href="./style.css">' >> ../Unity/Build/index.html
echo '<iframe src="../../web/src/editor" id="editor"></iframe>' >> ../Unity/Build/index.html
echo '' >> ../Unity/Build/index.html