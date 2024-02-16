let styleChoices = [];
let circles = [];
let maxSize = 45; // Maximum radius size
let minSize = .25; // Minimum radius size
let totalSprays = 10;
let totalCircles = 350; // Total number of circles to attempt to pack
// let totalSprays = 100;
let attemptLimit = 100; // Maximum attempts before moving to a smaller size
sizeTier = 1;
let denom = 2;
let frameThickness = 35; // Thickness of the frame
let frameToRectPad = 25; // Space between the frame and the rectangle range
let rectX = [];
let rectY = [];
let rectWidth = [];
let rectHeight = [];
let rectBound = [];
// let bgChoices = [[183, 74, 55]];
// let bgChoices = [[149, 201, 208]];
// let bgChoices = [[75, 94, 129]];
// let bgChoices = [[217, 208, 190]];
// let bgChoices = [[176, 18, 152]];
// let bgChoices = [[207, 44, 184]];
// let bgChoices = [[129, 131, 89]];
// let bgChoices = [[78, 119, 149]];
// let bgChoices = [[41, 140, 116]];
// let bgChoices = [[255, 11, 116]];
// let bgChoices = [[213, 115, 132]];
let bgChoices = [[255, 255, 255]];
let bgStyleChoices = ["vertStrips", "horStrips", "circles"];
const maxBranches = 1000;
const maxDepth = 2;
let attempts = 0;
let currentSize = null;
let circleCounts = null; 
let paletteChoices = [
   [[197, 100, 100], [0, 100, 100]],
   [[345, 100, 100], [40, 100, 100]],
   [[173, 100, 100], [244, 100, 100]],
   [[311, 100, 100], [193, 100, 100]],
   [[320, 100, 100], [60, 100, 100]]
];

let zoom = 1; // Initial zoom level

// Three.js specific setup
let scene, camera, renderer;

let img;
let img2;

function preload() {
   //  img = loadImage('fakeRothkoPepe.jpeg');
    // img = loadImage('albersHomageSquare.jpeg');
   //  img = loadImage('albers6.jpg');
   //  img = loadImage('monaLisa.jpg');
    // img = loadImage('homerPepe.jpg');
    img = loadImage('okeefe.jpg');
    // img = loadImage('IMG_6364.jpg');
   //  img = loadImage('cactus.jpg');
    // img = loadImage('ackstract.jpg');
   //  img = loadImage('starsFellACK.jpg');
   //  img = loadImage('myGirl.jpg');
   //  img = loadImage('yourGirl.jpg');
   //  img = loadImage('clyfford.jpg');
   //  img = loadImage('inBloom.jpg');
    // img = loadImage('cactus2.jpg');
    // img = loadImage('staples.jpg');
   //  img = loadImage('kanye.jpg');
   //  img = loadImage('guitarist.jpg');
   // img = loadImage('tromso.jpg');
   // img = loadImage('almondTreeZoomed.jpg');
}

function setup() {
   // createCanvas(1014, 760);
   // if (windowWidth > windowHeight * (2/3)) {
   //   canvasHeight = windowHeight;
   //   canvasWidth = canvasHeight * (2/3);
   // } else {
   //   canvasWidth = windowWidth;
   //   canvasHeight = canvasWidth * (3/2);
   // }
   // canvasWidth = img.width + frameThickness*2;
   // canvasHeight = img.height + frameThickness*2;
   canvasWidth = img.width - 8;
   canvasHeight = img.height;
   angleMode(DEGREES);
   myCanvas = createCanvas(canvasWidth, canvasHeight, WEBGL);
   console.log("image width:", img.width);
   // myCanvas = createCanvas(img.width, img.height);
   centerCanvas();
   window.addEventListener('wheel', (e) => {
      // Zoom in or out
      zoom += e.deltaY * -0.01;
      // Restrict scale
      zoom = constrain(zoom, 0.5, 2); // Adjust min and max zoom as needed
   });
   // colorMode(HSB); // Switch to HSB color mode
   bgColor = random(bgChoices);
   styleNums = [1, 2, 3, 4, 5, 6];
   // style = random(styleNums);
   style = 4;
   trueToPhoto = random() < 1;
   // bgStyle = random(bgStyleChoices);
   bgStyle = "circles"

   if (bgStyle == "circles") {
      totalSprays = 50;
   }

   palette = shuffle(random(paletteChoices));
   color1 = palette[0];
   color2 = palette[1];

   let top = random() < .5;
   let right = random() < .5;
   x1 = random(0, canvasWidth);
   y2 = random(0, canvasHeight);
   xEnd = random(canvasWidth/4, (canvasWidth*3)/4);
   yEnd = random(canvasHeight/4, (canvasHeight*3)/4);
   if (top) {
      y1 = 0;
   } else if (!top) {
      y1 = canvasHeight;
   }
   console.log("y1:", y1);
   if (right) {
      x2 = 0;
   } else if (!right) {
      x2 = canvasWidth;
   }

    // randomSeed(9921);
   //  numRect = random(2, 4);

   lineObstacles = random() < 1;

   numRect = 0;
    if (canvasHeight > canvasWidth) {
        for (let i = 0; i < numRect; i++) {
            isSquare = random() < .5;
            if (isSquare) {
                rectWidth[i] = random((canvasWidth - (2 * frameThickness))/8, (canvasWidth - (2 * frameThickness)) * (4/5));
                rectHeight[i] = rectWidth[i];
            } else {
                rectWidth[i] = random((canvasWidth - (2 * frameThickness))/8, (canvasWidth - (2 * frameThickness)) * (4/5));
                rectHeight[i] = random((canvasWidth - (2 * frameThickness))/8, (canvasWidth - (2 * frameThickness)) * (4/5));
            }
            rectX[i] = random(frameThickness + frameToRectPad, canvasWidth - rectWidth[i] - frameThickness - frameToRectPad);
            rectY[i] = random(frameThickness + frameToRectPad, canvasHeight - rectHeight[i] - frameThickness - frameToRectPad);
            // rectBound[i] = random(10, 25);
            rectBound[i] = random(25, 50);
        }
    } else {
        for (let i = 0; i < numRect; i++) {
            isSquare = random() < .5;
            if (isSquare) {
                rectWidth[i] = random((canvasHeight - (2 * frameThickness))/8, (canvasHeight - (2 * frameThickness)) * (3/4));
                rectHeight[i] = rectWidth[i];
            } else {
                rectWidth[i] = random((canvasHeight - (2 * frameThickness))/8, (canvasHeight - (2 * frameThickness)) * (3/4));
                rectHeight[i] = random((canvasHeight - (2 * frameThickness))/8, (canvasHeight - (2 * frameThickness)) * (3/4));
            }
            rectX[i] = random(frameThickness + frameToRectPad, (canvasWidth) - (rectWidth[i]) - frameThickness - frameToRectPad);
            rectY[i] = random(frameThickness + frameToRectPad, (canvasHeight) - (rectHeight[i]) - frameThickness - frameToRectPad);
            // rectBound[i] = random(10, 25);
            rectBound[i] = random(35, 65);
        }
    }
    const d = (new Date()).getMilliseconds();
    // randomSeed(d)
    currentSize = maxSize;
    circleCounts = {}; // Track the number of circles for each size

    if (style === 5) {
        setupThreeJS();
    } else if (style != 5 && style != 6) {
        background(bgColor);
    }
    // Scale brushes to adapt to canvas size
    brush.scaleBrushes(1.5);

    // Activate the flowfield we're going to use
    brush.field("seabed");

    img.loadPixels();
}

function saveArtwork() {
   saveCanvas(myCanvas, 'myArtwork', 'jpg'); // Save the canvas as 'myArtwork.jpg'
}

function centerCanvas() {
   let x = (windowWidth - width) / 2;
   let y = (windowHeight - height) / 2;
   myCanvas.position(x, y);
 }

function windowResized() {
   centerCanvas();
}

let layer1 = true;
let layer2 = false;

function draw() {
   frameRate(30);
   translate(-width / 2, -height / 2); // Adjust for WEBGL's center origin

   if (layer1) {
      for (let i = 0; i < totalSprays; i++){
         // let x = random(frameThickness, canvasWidth - frameThickness);
         // let y = random(frameThickness, canvasHeight - frameThickness);
         let brushStyle = "marker2";
         if (bgStyle == "vertStrips") {
            x = (canvasWidth/(totalSprays*2))*(i + 1);
            y = height/2;
         } else if (bgStyle == "horStrips") {
            x = width/2;
            y = (canvasHeight/(totalSprays*2))*(i + 1);
         } else if (bgStyle == "circles") {
            x = random(canvasWidth);
            y = random(canvasHeight);
         }
         let imgX = constrain(floor(x), 0, img.width);
         let imgY = constrain(floor(y), 0, img.height);
         let color = img.get(imgX, imgY);
         color[1] = 25;
         color[2] = 80;
         brush.set(brushStyle, color, 1);
         // Render pre-calculated scribbles
         brush.fill(color, 100);
         if (bgStyle == "vertStrips") {
            brush.rect((canvasWidth/totalSprays)*i, frameThickness, (canvasWidth/totalSprays)*1.5, canvasHeight);
         } else if (bgStyle == "horStrips") {
            brush.rect(frameThickness, (canvasHeight/totalSprays)*i, canvasWidth, (canvasHeight/totalSprays)*1.5);
         } else if (bgStyle == "circles") {
            brush.circle(x, y, 200);
         }

      }
         // if (color[1] <= 120) {
         //    color[1] = color[1] + 150;
         // } else if (color[1] > 120) {
         //    color[1] = color[1] - 80;
         // }
         // if (color[0] <= 70) {
         //    color[0] = color[0] + 120;
         // } else if (color[0] < 170 && color[0] > 70) {
         //    color[0] = color[0] + 90;
         // }

         // color[1] = color[1] - 70;
         // let brushStyle = brush.box()[Math.floor(Math.random() * brush.box().length)];

   }
      layer1 = false;
      layer2 = true;
   
   if (layer2 && circles.length < totalCircles) {
      currentSize = max(currentSize, minSize);
      let maxCircles;
      circleCounts[currentSize] = 0; // Initialize count for the current size
      maxCircles = Math.floor(Math.pow(2, (sizeTier * 1.1)));
      if (circleCounts[currentSize] < maxCircles) {
         let y = random(height);
         let newCircle = nextCircle();
         if (style == 4) {
            calculateScribbles(newCircle);
         }
         circles.push(newCircle);
      }
      if (circles.length > 0) {
         if (style == 1) {
            parallelHatch();
         } else if (style == 2) {
            crossHatch();
         } else if (style == 3) {
            contourHatch();
         } else if (style == 4) {
            scribbleHatch();
         } else if (style == 5) {
            threeDim();
         } else if (style == 6) {
            threeDimGlasses();
         }
      }
   }
   if (layer2 && style == 5) {
      renderer.render(scene, camera);
   }
}

function newCircle(){
    let x = random(width);
    let y = random(height);
    let r = currentSize; // Assuming currentSize is your circle's radius
  
    // Ensure the circle's center point is within the bounds of the image
    let imgX = constrain(floor(x), 0, img.width - 1);
    let imgY = constrain(floor(y), 0, img.height - 1);
    let color = img.get(imgX - frameThickness, imgY - frameThickness); // Get the color of the image at the circle's center
  
    let newCircle = {
        x: x,
        y: y,
        r: r,
        color: color, // Set the circle's color to the image pixel's color
        randomAngle: random(360),
        crossHatch: PI/2,
        scribbles: []
    };
    return newCircle;
}

function nextLayer(branches){
   let new_branches = [];
   for (let b of branches) {
      for (let i = 0; i < maxBranches; i++){
         // make copy of b. Call it new_b
         let new_b = [...b];
         //append new circle to new_b
         new_b.push(newCircle());
         //append new_b to new_branches
         new_branches.push(new_b);
      }
   }
   if (branches.length === 0){
      for (let i = 0; i < maxBranches; i++){
         // make copy of b. Call it new_b
         let new_b = [];
         //append new circle to new_b
         new_b.push(newCircle());
         //append new_b to new_branches
         new_branches.push(new_b);
      }
   }
   return new_branches;
}

function validNewLayer(branches){
   return branches.filter(b => !collides(b[b.length - 1], b.slice(0, -1)));
}

function getHeadAtRandom(branches){
   return random(branches)[0];
}

function shrink(){
   currentSize = currentSize * (sizeTier/denom); 
   sizeTier += 1;
   denom += 1;
}

function nextCircle() {
   let branches = [];
   for(let i = 0; i < maxDepth; i++){
      if (i === maxDepth - 1) {
         let new_branches = [];
         for (let b of branches) {
            for (let i = 0; i < maxBranches; i++){
               // make copy of b. Call it new_b
               //append new circle to new_b
               const c = newCircle();
               if (!collides(c, b)){
                  return b[0];
               }
            }
         }
         if (branches.length === 0){
            for (let i = 0; i < maxBranches; i++){
               // make copy of b. Call it new_b
               const c = newCircle();
               if (!collides(c)){
                  return c;
               }
            }
         }
      } else {
         let new_branches = nextLayer(branches);
         new_branches = validNewLayer(new_branches);
         if (new_branches.length === 0) {
            if (branches.length === 0){
               shrink();
               return nextCircle();
            }
            return getHeadAtRandom(branches);
         }
         delete branches;
         branches = new_branches;
      }
   }
   if (branches.length === 0) {
      shrink();
      return nextCircle();
   } else {
      return getHeadAtRandom(branches);
   }
}

// function parallelHatch() {
//    let circle = circles[circles.length - 1];
//    let numLines = circle.r * 3; // Proportional to the radius
//    let lineSpacing = (circle.r * 2) / numLines;

//    push(); // Isolate transformations
//    translate(circle.x, circle.y); // Move to the circle's center
//    rotate(circle.randomAngle); // Apply rotation
   
//    fill(circle.color);
//    noStroke();
//    ellipse(0, 0, circle.r * 2, circle.r * 2);

//    stroke(0, 0, 0); // Color of the hatching lines
//    strokeWeight(.2); // Thickness of the hatching lines

//    for (let i = 0; i <= numLines; i++) {
//       let y = -circle.r + i * lineSpacing;
//       let xDelta = sqrt(circle.r * circle.r - y * y);
//       line(-xDelta, y, xDelta, y);
//    }

//    pop(); // Revert transformations
// }

function parallelHatch() {
   let circle = circles[circles.length - 1];
   let numLines = random(circle.r/4, (circle.r)/(circle.y/window.innerHeight)); // Proportional to the radius
   // let lineSpacing = circle.r * (circle.y*(8/window.innerHeight)) / numLines;
   let lineSpacing = (circle.r * 2)/numLines;
   let lineThickness = 1;
   
   push(); // Isolate transformations
   translate(circle.x, circle.y); // Move to the circle's center
   
   // Apply rotation for the hatching lines
   rotate(circle.randomAngle); // Use the circle's randomAngle property
   
   // Drawing the hatching lines
   stroke(circle.color); // Color of the hatching lines
   // strokeWeight(random(3)); // Thickness of the hatching lines
   for (let i = 0; i <= numLines; i++) {
      strokeWeight(lineThickness);
    //   lineThickness = lineThickness + .005;
      // strokeWeight(random(3)); // Thickness of the hatching lines
      let y = -circle.r + i * lineSpacing;
      let xDelta = sqrt(circle.r * circle.r - y * y); // Calculate the horizontal span of the line within the circle
      line(-xDelta, y, xDelta, y); // Draw the line
   }
   
   // Applying a mask with the ellipse
   // Note: In p5.js, you cannot directly mask shapes like this.
   // This would conceptually mask the hatching lines with the circle's shape,
   // but for actual masking, you'd typically use createGraphics() and work with images.
   fill(0,0,0,0); // Set the fill color for the ellipse
   noStroke(); // No border for the ellipse
   ellipse(0, 0, circle.r * 2, circle.r * 2); // Draw the ellipse over the hatching lines
   
   pop(); // Revert transformations
 }

function crossHatch() {
   let circle = circles[circles.length - 1];
   let numLines = circle.r * 1.5; // Proportional to the radius
   let lineSpacing = (circle.r * 2) / numLines;

   push(); // Isolate transformations
   translate(circle.x, circle.y); // Move to the circle's center
   rotate(circle.randomAngle); // Apply rotation

   fill(circle.color);
   noStroke();
   ellipse(0, 0, circle.r * 2, circle.r * 2);

   stroke(0, 0, 0); // Color of the hatching lines
   strokeWeight(.35); // Thickness of the hatching lines

   for (let i = 0; i <= numLines; i++) {
      let y = -circle.r + i * lineSpacing;
      let xDelta = sqrt(circle.r * circle.r - y * y);
      line(-xDelta, y, xDelta, y);
   }

   rotate(circle.crossHatch); // Apply rotation

   for (let j = 0; j <= numLines; j++) {
      let y = -circle.r + j * lineSpacing;
      let xDelta = sqrt(circle.r * circle.r - y * y);
      line(-xDelta, y, xDelta, y);
   }

   pop(); // Revert transformations
}

function contourHatch(){
   let circle = circles[circles.length - 1];
   let numContours = circle.r / 2; // Adjust the density of contour lines
   let contourSpacing = circle.r / numContours;

   push(); // Isolate transformations
   translate(circle.x, circle.y); // Move to the circle's center
   rotate(circle.randomAngle); // Apply rotation

   fill(circle.color);
   noStroke();
   ellipse(0, 0, circle.r * 2, circle.r * 2);

   stroke(0, 0, 0); // Color of the hatching lines
   strokeWeight(.45); // Thickness of the hatching lines

   // Draw each contour line
   for (let i = 0; i < numContours; i++) {
         let contourRadius = circle.r - i * contourSpacing;
         if (contourRadius > 0) {
            ellipse(0, 0, contourRadius * 2, contourRadius * 2);
         }
   }

   pop(); // Revert transformations
}

// function spray() {
//    let circle = circles[circles.length - 1];
//    push();
//    translate(circle.x, circle.y);

//    let brushStyle = brush.box()[Math.floor(Math.random() * brush.box().length)];
//    brushStyle = "spray";

//    let c0 = circle.color[0] + random(-20, 20);
//    let c1 = circle.color[1] + random(-20, 20);
//    let c2 = circle.color[2] + random(-20, 20);
//    let c = color(c0, c1, c2);
//    brush.set(brushStyle, c, 1);
//    // brush.spline(scribble[0], 1);

//    // fill(circle.color);
//    // noStroke();
//    // ellipse(0, 0, circle.r * 2, circle.r * 2);
// }

// function sprayHatch() {
//    let circle = sprayCircles[sprayCircles.length - 1];
//    push(); // Isolate transformations
//    translate(circle.x, circle.y); // Move to the circle's center

//    let brushStyle = brush.box()[Math.floor(Math.random() * brush.box().length)];
//    brushStyle = "spray";
//    // Render pre-calculated scribbles
//    for (let scribble of circle.scribbles) {
//       if (trueToPhoto) {
//          let c0 = circle.color[0] + random(-20, 20);
//          let c1 = circle.color[1] + random(-20, 20);
//          let c2 = circle.color[2] + random(-20, 20);
//          let c = color(c0, c1, c2);
//          brush.set(brushStyle, c, 1);
//          brush.spline(scribble[0], 1);
//       } else {
//          let c = color(230, 150, scribble[1]);
//          brush.set(brushStyle, c, 1);
//          brush.spline(scribble[0], 1);
//       }
//    }

//    pop(); // Revert transformations
// }

function scribbleHatch() {
   let circle = circles[circles.length - 1];
   push(); // Isolate transformations
   translate(circle.x, circle.y); // Move to the circle's center

   let brushStyle = brush.box()[Math.floor(Math.random() * brush.box().length)];
   brushStyle = "spray";

   brush.add("customSpray1", {
      type: "spray",       // this is the TIP TYPE: choose standard / spray / marker / custom / image
      weight: 5,          // Base weight of the brush tip
      vibration: 3,        // Vibration of the lines, spread
      definition: 0.05,     // Between 0 and 1
      quality: 5,          // + quality = more continuous line
      opacity: 50,         // Base opacity of the brush (this will be affected by pressure)
      spacing: 10,          // Spacing between the points that compose the brush stroke
      blend: true,         // Activate / Disable realistic color mixing
      pressure: {
          type: "standard", // Use “standard” for simple gauss bell curve
          curve: [0.15,0.2],  // If "standard", pick a and b values for the gauss curve
          min_max: [0.5,1.2]  // For both cases, define min and max pressure (reverse for inverted presure)
      },
      // For "custom" and "image" types, you can define the tip angle rotation here.
      rotate: "random", // "none" disables rotation | "natural" follows the stroke | "random"
   })

   brush.add("customMarker", {
      type: "marker",       // this is the TIP TYPE: choose standard / spray / marker / custom / image
      weight: 20,          // Base weight of the brush tip
      vibration: 2,        // Vibration of the lines, spread
      definition: 0.85,     // Between 0 and 1
      quality: 8,          // + quality = more continuous line
      opacity: 70,         // Base opacity of the brush (this will be affected by pressure)
      spacing: 5,          // Spacing between the points that compose the brush stroke
      blend: true,         // Activate / Disable realistic color mixing
      pressure: {
          type: "standard", // Use “standard” for simple gauss bell curve
          curve: [0.15,0.2],  // If "standard", pick a and b values for the gauss curve
          min_max: [0.5,1.2]  // For both cases, define min and max pressure (reverse for inverted presure)
      },
      // For "custom" and "image" types, you can define the tip angle rotation here.
      rotate: "random", // "none" disables rotation | "natural" follows the stroke | "random"
   })

   // Render pre-calculated scribbles
   for (let scribble of circle.scribbles) {
      if (trueToPhoto) {
         let c0 = circle.color[0] + random(-20, 20);
         let c1 = circle.color[1] + random(-20, 20);
         let c2 = circle.color[2] + random(-20, 20);
         let c = color(c0, c1, c2);
         brush.set("pen", c, 1);
         brush.spline(scribble[0], 1);
      } else {
         let c = color(scribble[1], 160, 165);
         brush.set(brushStyle, c, 1);
         brush.spline(scribble[0], 1);
      }
   }

   pop(); // Revert transformations
}

function threeDim() {
   for (let circle of [circles[circles.length - 1]]) {
      createThreeJSSphere(circle);
  }
}

function threeDimGlasses() {
   let circle = circles[circles.length - 1];
   push(); // Isolate transformations
   // translate(circle.x, circle.y); // Move to the circle's center
   colorMode(RGB);  // Ensure HSB mode is set
   c = HSBtoRGB(hue(circle.color), saturation(circle.color), brightness(circle.color));
   let offset = circle.r/10; // Adjust this value to control the 3D effect strength
   blendMode(BLEND);
   strokeWeight(30);

   // noStroke();
   // fill(circle.color); // Set fill to red color
   // ellipse(circle.x + offset, circle.y, circle.r * 2, circle.r * 2);
   // Define the red color with transparency
   const redValue = red(c);
   noStroke();
   fill(color(redValue, 0, 0, 127)); // Set fill to red color
   ellipse(circle.x + offset, circle.y, circle.r * 2, circle.r * 2);

   // noStroke();
   // fill(circle.color); // Set fill to blue color
   // ellipse(circle.x - offset, circle.y, circle.r * 2, circle.r * 2);
   // Define the blue color with transparency
   const blueValue = blue(c);
   const greenValue = green(c);
   noStroke();
   fill(color(0, greenValue, blueValue, 127)); // Set fill to blue color
   ellipse(circle.x - offset, circle.y, circle.r * 2, circle.r * 2);
}

function stippleHatch() {

}

function zigZagHatch() {

}

function setupThreeJS() {

   // Assuming canvasWidth and canvasHeight are the dimensions of your p5.js canvas
   let canvasWidth = myCanvas.width;
   let canvasHeight = myCanvas.height;

   scene = new THREE.Scene();
   camera = new THREE.OrthographicCamera(-canvasWidth / 2, canvasWidth / 2, canvasHeight / 2, -canvasHeight / 2, 1, 1000);
   renderer = new THREE.WebGLRenderer({ alpha: true }); // Enable transparency if needed
   renderer.setSize(canvasWidth, canvasHeight);

   // Set the renderer to the same size as the canvas
   renderer = new THREE.WebGLRenderer({ alpha: true }); // Enable transparency
   renderer.setSize(canvasWidth, canvasHeight);
   // Center the renderer in the window
   renderer.domElement.style.position = 'absolute';
   renderer.domElement.style.top = '50%';
   renderer.domElement.style.left = '50%';
   renderer.domElement.style.transform = 'translate(-50%, -50%)';

   // Add the renderer to the body or a specific element in your HTML
   document.body.appendChild(renderer.domElement);

   // Assuming bgColor is something like [hue, saturation, brightness]
   let bgColorRGB = HSBtoRGB(bgColor[0], bgColor[1], bgColor[2]);
   let backgroundColor = new THREE.Color(`rgb(${bgColorRGB[0]}, ${bgColorRGB[1]}, ${bgColorRGB[2]})`);
    
   // Set the background color of the renderer
   renderer.setClearColor(backgroundColor);

   // Position the camera to view the scene
   camera.position.set(0, 0, 500); // Adjust the Z position as needed
   camera.lookAt(scene.position); // Make the camera look at the center of the scene

   // Point Light
   let pointLight = new THREE.PointLight(0xffffff, 1, 5000);
   pointLight.position.set(50, 50, 150);
   scene.add(pointLight);

   camera.position.z = 500;
}

function createThreeJSSphere(circle) {
   let geometry = new THREE.SphereGeometry(circle.r, 32, 32);
   //  let material = new THREE.MeshBasicMaterial({ color: circle.color });

   // Generate color using the same method as in p5.js
   let color = getRandomColor(circle.y / window.innerHeight); // Adjust as necessary
   
   // // Use MeshStandardMaterial or MeshPhongMaterial for better lighting effects
   // let material = new THREE.MeshStandardMaterial({
   //    color: color,
   //    roughness: 0.5, // Adjust for material roughness
   //    metalness: 0.1  // Adjust for metalness
   // });

   const options = {
      enableSwoopingCamera: false,
      enableRotation: true,
      transmission: .1,
      thickness: .6,
      roughness: 1,
      envMapIntensity: 1.5,
      clearcoat: .1,
      clearcoatRoughness: 0.1,
      normalScale: 1,
      clearcoatNormalScale: 10,
      normalRepeat: 1
    };

   const textureLoader = new THREE.TextureLoader();
   const normalMapTexture = textureLoader.load("normal.jpg");
   normalMapTexture.wrapS = THREE.RepeatWrapping;
   normalMapTexture.wrapT = THREE.RepeatWrapping;
   normalMapTexture.repeat.set(options.normalRepeat, options.normalRepeat);

   const material = new THREE.MeshPhysicalMaterial({  
      color: color,
      transmission: options.transmission,
      thickness: options.thickness,
      roughness: options.roughness,
      envMapIntensity: options.envMapIntensity,
      clearcoat: options.clearcoat,
      clearcoatRoughness: options.clearcoatRoughness,
      normalScale: new THREE.Vector2(options.normalScale),
      normalMap: normalMapTexture,
      clearcoatNormalMap: normalMapTexture,
      clearcoatNormalScale: new THREE.Vector2(options.clearcoatNormalScale)
    });

   let sphere = new THREE.Mesh(geometry, material);

   // sphere.position.set(circle.x, circle.y, 0);
      // Adjust position to align with p5.js coordinates
      sphere.position.set(circle.x - myCanvas.width / 2, -circle.y + myCanvas.height / 2, 0);
   scene.add(sphere);
}

// Function to convert HSB to RGB
function HSBtoRGB(h, s, b) {
   s /= 100;
   b /= 100;
   let k = (n) => (n + h / 60) % 6;
   let f = (n) => b - b * s * Math.max(Math.min(k(n), 4 - k(n), 1), 0);
   return [
      Math.round(255 * f(5)), // Red
      Math.round(255 * f(3)), // Green
      Math.round(255 * f(1))  // Blue
   ];
}

function getRandomColor(position) {
   // Define the mean and standard deviation for the normal distribution
   let hueMean = lerp(color1[0], color2[0], position);
   let hueSD = 40; // Standard deviation
 
   // Generate a random hue value based on the normal distribution
   let hue = randomGaussian(hueMean, hueSD);
 
   // Keep the hue within the 0-360 range
   hue = (hue + 360) % 360;

   if (style === 5) {
      return new THREE.Color(`hsl(${hue}, 100%, 50%)`); // Convert HSB/HSV to HSL
   } else {
      return color(hue, 100, 100);
   }
}

function collides(circle, additional_circles=[]) {
   for (let other of circles.concat(additional_circles)) {
      if (style === 6) {
         d = .9 * dist(circle.x, circle.y, other.x, other.y);
      } else {
         d = dist(circle.x, circle.y, other.x, other.y);
      }
      if (d < (circle.r + other.r)) {
         return true;
      }
   }

   // Check collision with the frame
   let frameInnerEdgeX = frameThickness;
   let frameInnerEdgeY = frameThickness;
   let frameOuterEdgeX = width - frameThickness;
   let frameOuterEdgeY = height - frameThickness;

   if (circle.x - circle.r < frameInnerEdgeX ||
      circle.x + circle.r > frameOuterEdgeX ||
      circle.y - circle.r < frameInnerEdgeY ||
      circle.y + circle.r > frameOuterEdgeY) {
      return true;
   }

   if (lineObstacles) {
      // Define an array of lines with their start and end points
      let lines = [
         { start: { x: x1, y: y1 }, end: { x: xEnd, y: yEnd } },
         { start: { x: x2, y: y2 }, end: { x: xEnd, y: yEnd } }
         // Add more lines here as needed
         // { start: { x: startX, y: startY }, end: { x: endX, y: endY } },
      ];

      let buffer = 40; // Buffer distance

      // Check collision with each line
      for (let i = 0; i < lines.length; i++) {
         let lineStart = lines[i].start;
         let lineEnd = lines[i].end;

         // Calculate the normal vector to the line
         let lineVector = { x: lineEnd.x - lineStart.x, y: lineEnd.y - lineStart.y };
         let normalVector = { x: -lineVector.y, y: lineVector.x };
         let normalLength = sqrt(normalVector.x * normalVector.x + normalVector.y * normalVector.y);
         normalVector.x /= normalLength;
         normalVector.y /= normalLength;

         // Calculate the distance from the circle center to the line
         let circleToLineStart = { x: circle.x - lineStart.x, y: circle.y - lineStart.y };
         let distance = abs(circleToLineStart.x * normalVector.x + circleToLineStart.y * normalVector.y);

         // Check if the circle is within the buffer zone of the line
         if (distance < circle.r + buffer) {
            // Check if the circle is between the start and end points of the line
            let dotProduct = circleToLineStart.x * lineVector.x + circleToLineStart.y * lineVector.y;
            if (dotProduct >= 0 && dotProduct <= lineVector.x * lineVector.x + lineVector.y * lineVector.y) {
               return true; // Collision detected
            }
         }
      }
   }

   // Check collision with the rectangle
   for (let i = 0; i < numRect; i++) {
      if ((circle.x + circle.r > rectX[i] &&
         circle.x - circle.r < rectX[i] + rectBound[i] &&
         circle.y + circle.r > rectY[i] &&
         circle.y - circle.r < rectY[i] + rectHeight[i]) ||

         (circle.y + circle.r > rectY[i] &&
         circle.y - circle.r < rectY[i] + rectBound[i] &&
         circle.x + circle.r > rectX[i] &&
         circle.x - circle.r < rectX[i] + rectWidth[i]) ||

         (circle.x - circle.r < rectX[i] + rectWidth[i] &&
         circle.x + circle.r > rectX[i] + rectWidth[i] - rectBound[i] &&
         circle.y + circle.r > rectY[i] &&
         circle.y - circle.r < rectY[i] + rectHeight[i]) ||

         (circle.y - circle.r < rectY[i] + rectHeight[i] &&
         circle.y + circle.r > rectY[i] + rectHeight[i] - rectBound[i] &&
         circle.x + circle.r > rectX[i] &&
         circle.x - circle.r < rectX[i] + rectWidth[i])) {

         return true;
      }
   }

   return false;
}

function calculateScribbles(circle) {
   let numScribbles = (PI * circle.r * circle.r) / 15; // Proportional to the area

   for (let i = 0; i < numScribbles; i++) {
      let startX = random(-circle.r, circle.r);
      let startY = random(-circle.r, circle.r);
      let endX = random(-circle.r, circle.r);
      let endY = random(-circle.r, circle.r);

      //  // Ensure start and end points are within the circle
      if (dist(0, 0, startX, startY) < circle.r && dist(0, 0, endX, endY) < circle.r) {
         const control_points_size = 3;
         const control_points = [];
         while (control_points.length < control_points_size) {
            let cX = random(-circle.r, circle.r);
            let cY = random(-circle.r, circle.r);
            if (dist(0, 0, cX, cY) < circle.r) {
               control_points.push([cX, cY]);
            }
         }

         const points = [[startX, startY]].concat(control_points).concat([[endX, endY]]);
         let hueDiff = random(-30, 30);
         let fillHue = (hue(circle.color) + hueDiff);
         fillHue = (fillHue + 360) % 360;

         //   // Store each scribble
         circle.scribbles.push([points, fillHue]);
      }
   }
}