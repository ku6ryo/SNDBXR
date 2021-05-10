BUILD_DIR=./build

rm -rf $BUILD_DIR || true
cp -r ../Unity/Build $BUILD_DIR

cp ./src/ConnectorBase.js $BUILD_DIR
cp ./src/ConnectorUnity.js $BUILD_DIR
cp ./src/main.js $BUILD_DIR
cp ./src/style.css $BUILD_DIR

INDEX_HTML=$BUILD_DIR/index.html

echo '<!-- added -->' >> $INDEX_HTML
echo '<script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js"></script>' >> $INDEX_HTML
echo '<script src="./ConnectorBase.js"></script>' >> $INDEX_HTML
echo '<script src="./ConnectorUnity.js"></script>' >> $INDEX_HTML
echo '<script src="./main.js"></script>' >> $INDEX_HTML
echo '<link rel="stylesheet" href="./style.css">' >> $INDEX_HTML
echo '<iframe src="../src/editor" id="editor"></iframe>' >> $INDEX_HTML