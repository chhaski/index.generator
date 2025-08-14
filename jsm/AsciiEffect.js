class AsciiEffect {

    constructor(renderer, charSet = ' .:-=+*#%@', options = {}) {

        const fResolution = options['resolution'] || 0.2;
const bColor = options['color'] || false;
        const bInvert = options['invert'] || false; // Inverts colors

        let width, height;

        const domElement = document.createElement('div');
        domElement.style.cursor = 'default';
        domElement.style.width = '100%';
        domElement.style.height = '100%';
        domElement.style.overflow = 'hidden';
        domElement.style.display = 'flex';
        domElement.style.justifyContent = 'center';
        domElement.style.alignItems = 'center';

        const oAscii = document.createElement('pre');
        oAscii.style.width = '100%';
        oAscii.style.height = '100%';
        oAscii.style.overflow = 'hidden';
        oAscii.style.whiteSpace = 'pre-wrap';
        domElement.appendChild(oAscii);

        let iWidth, iHeight;
        let oImg;

        this.setSize = function (w, h) {
            width = w;
            height = h;
            renderer.setSize(w, h);
            initAsciiSize();
        };

        this.render = function (scene, camera) {
            renderer.render(scene, camera);
            asciifyImage(oAscii);
        };

        this.domElement = domElement;

        function initAsciiSize() {
            // Calculate canvas dimensions based on window size and resolution
            iWidth = Math.floor(width * fResolution);
            iHeight = Math.floor(height * fResolution);

            oCanvas.width = iWidth;
            oCanvas.height = iHeight;

            oImg = renderer.domElement;

            // Clear previous content and set styles for ASCII display
            oAscii.innerHTML = '';
            
            // Ensure each character occupies a square area
            const charAspect = 0.6; // Typical aspect ratio for monospace font characters
            const charWidth = width / iWidth;
            const charHeight = height / iHeight;
            const fontSize = Math.min(charWidth / charAspect, charHeight);

            oAscii.style.fontFamily = 'courier new, monospace';
            oAscii.style.fontSize = `${fontSize}px`;
            oAscii.style.lineHeight = `${fontSize}px`;
            oAscii.style.letterSpacing = `${charWidth - fontSize * charAspect}px`;
        }

        const aDefaultCharList = (' .,:;i1tfLCG08@').split('');
        const aDefaultColorCharList = (' CGO08@').split('');

        const oCanvasImg = renderer.domElement;

        const oCanvas = document.createElement('canvas');
        if (!oCanvas.getContext) {
            return;
        }

        const oCtx = oCanvas.getContext('2d');
        if (!oCtx.getImageData) {
            return;
        }

        let aCharList = (bColor ? aDefaultColorCharList : aDefaultCharList);
        if (charSet) aCharList = charSet;

        function asciifyImage(oAscii) {
            oCtx.clearRect(0, 0, iWidth, iHeight);
            oCtx.drawImage(oCanvasImg, 0, 0, iWidth, iHeight);
            const oImgData = oCtx.getImageData(0, 0, iWidth, iHeight).data;

            let strChars = '';

            for (let y = 0; y < iHeight; y++) {
                for (let x = 0; x < iWidth; x++) {
                    const iOffset = (y * iWidth + x) * 4;

                    const iRed = oImgData[iOffset];
                    const iGreen = oImgData[iOffset + 1];
                    const iBlue = oImgData[iOffset + 2];
                    const iAlpha = oImgData[iOffset + 3];

                    let fBrightness = (0.3 * iRed + 0.59 * iGreen + 0.11 * iBlue) / 255;

                    if (iAlpha == 0) {
                        fBrightness = 1;
                    }

                    let iCharIdx = Math.floor((1 - fBrightness) * (aCharList.length - 1));

                    if (bInvert) {
                        iCharIdx = aCharList.length - iCharIdx - 1;
                    }

                    let strThisChar = aCharList[iCharIdx];

                    if (bColor) {
                        strThisChar = `<span style='color:rgb(${iRed},${iGreen},${iBlue});'>${strThisChar}</span>`;
                    }

                    strChars += strThisChar;
                }
                strChars += '\n';
            }

            oAscii.innerHTML = strChars;
        }

    }

}

export { AsciiEffect };
