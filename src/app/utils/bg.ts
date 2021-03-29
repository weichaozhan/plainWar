interface IPaintBGParams {
  ctx: CanvasRenderingContext2D;
  y: number;
  canvasW: number;
  canvasH: number;
}

export const paintBG = (function() {
  const bg = new Image();

  let imgLoaded = false;

  bg.src = `${APP_STATIC_PROTOCAL}${APP_STATIC_PATH}/bg1.png`;

  return (params: IPaintBGParams) => {
    const { ctx, y, canvasH, canvasW } = params;
    const bgX = 0;
    const bgY = y;
    
    ctx.beginPath();
    ctx.moveTo(bgX, bgY);
    
    const paintImg = () => {
      ctx.drawImage(bg, bgX, bgY, canvasW, canvasH);
      ctx.drawImage(bg, bgX, bgY - canvasH, canvasW, canvasH);
      ctx.closePath();
    };

    imgLoaded = bg.complete;
    
    if (imgLoaded) {
      paintImg();
    }
    
    bg.onload = () => {
      paintImg();
      imgLoaded = true;
    }
  }
})();