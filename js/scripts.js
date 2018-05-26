//control elements
var posX;
var bounds;
var count;

//scene elements
var displacementSprite; 
var mountains; 
var trees; 
var cloud1;
var cloud2; 
var blur1;
var blur2; 
var logo;

//Create full screen application and add it to the page
var app = new PIXI.Application(window.innerWidth, window.innerHeight);
document.body.appendChild(app.view);

app.stage.interactive = true;

//Create the container for the scenery elements
var container = new PIXI.Container();
app.stage.addChild(container);

//Load all images required
PIXI.loader.add("../img/logo_NRM.png");
PIXI.loader.add("../img/logo.png");
PIXI.loader.add("../img/bg.jpg");
PIXI.loader.add("../img/mountains.png");
PIXI.loader.add("../img/trees.png");
PIXI.loader.add("../img/cloud1.png");
PIXI.loader.add("../img/cloud2.png");
PIXI.loader.add("../img/blur1.png");
PIXI.loader.add("../img/blur2.png");

//Run setup
PIXI.loader.load(setup);

function setup() {

    posX = 0;
    count = 0;

    //Insert the normal map for the logo - this will create the displacement (glass) effect
    displacementSprite = new PIXI.Sprite(PIXI.loader.resources["../img/logo_NRM.png"].texture);
    var displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
    displacementSprite.anchor.set(0.5);
    displacementSprite.x = app.renderer.width / 2;
    displacementSprite.y = app.renderer.height / 2;

    app.stage.addChild(displacementSprite); //added to stage (foreground)

    //Insert the logo that will use the displacement map/filter
    logo = new PIXI.Sprite(PIXI.loader.resources["../img/logo.png"].texture);
    logo.anchor.set(0.5);
    logo.x = app.renderer.width / 2;
    logo.y = app.renderer.height / 2;
    logo.alpha = 0.5;

    app.stage.addChild(logo);   //added to stage (foreground)
    
    //Apply the displacement filter
    container.filters = [displacementFilter];
    displacementFilter.scale.x = 120;
    displacementFilter.scale.y = 120;
    
    //Insert the background image 
    bg = new PIXI.Sprite(PIXI.loader.resources["../img/bg.jpg"].texture);
    bg.width = app.renderer.width;
    bg.height = app.renderer.height;

    container.addChild(bg); //added to the container (background)

    //Insert the left blur
    blur1 = new PIXI.Sprite(PIXI.loader.resources["../img/blur1.png"].texture);
    blur1.anchor.set(0.5);
    blur1.scaleX = 3;
    blur1.x = app.renderer.width / 4;
    blur1.y = app.renderer.height / 2;

    container.addChild(blur1);

    //Insert the right blur
    blur2 = new PIXI.Sprite(PIXI.loader.resources["../img/blur2.png"].texture);
    blur2.anchor.set(0.5);
    blur2.scaleX = 3;
    blur2.x = app.renderer.width / 2 + app.renderer.width / 4; //find the middle and add quarter
    blur2.y = app.renderer.height / 2;

    container.addChild(blur2);

    //Insert the moutains
    mountains = new PIXI.Sprite(PIXI.loader.resources["../img/mountains.png"].texture);
    mountains.anchor.set(0.5);
    mountains.x = app.renderer.width / 2;
    mountains.y = app.renderer.height - (mountains.height / 2);
    
    container.addChild(mountains);

    //Insert the background clouds
    cloud1 = new PIXI.Sprite(PIXI.loader.resources["../img/cloud1.png"].texture);
    cloud1.anchor.set(0.5);
    cloud1.x = app.renderer.width / 2;
    cloud1.y = cloud1.height / 2;
    cloud1.blendMode = PIXI.BLEND_MODES.OVERLAY;

    container.addChild(cloud1);

    //Insert the trees
    trees = new PIXI.Sprite(PIXI.loader.resources["../img/trees.png"].texture);
    trees.anchor.set(0.5);
    trees.x = app.renderer.width / 2;
    trees.y = app.renderer.height - (trees.height / 2);
    
    container.addChild(trees);

    //Insert the foreground clouds
    cloud2 = new PIXI.Sprite(PIXI.loader.resources["../img/cloud2.png"].texture);
    cloud2.anchor.set(0.5);
    cloud2.x = app.renderer.width / 2;
    cloud2.y = app.renderer.height - (cloud2.height / 2);
    cloud2.blendMode = PIXI.BLEND_MODES.OVERLAY;
    
    container.addChild(cloud2);

    //Add event handlers
    app.stage.on('mousemove', onPointerMove).on('touchmove', onPointerMove);

    //Run
    loop();
}

function onPointerMove(eventData) {
    posX = eventData.data.global.x;
}

function deltaX(amount) {
    var mouseX = posX;
    var screenCenter = app.renderer.width / 2;
    var degreeOfMovement = amount;
    return ((mouseX - screenCenter) / degreeOfMovement);
}


function loop() {

    requestAnimationFrame(loop); //Run at as close to 60fps as possible

    //Set parallax movement with deltaX value indicating the degreeOfMovement for each layer
    //The further away the larger the deltaX value
    mountains.x = app.renderer.width / 2 - deltaX(3);
    cloud1.x = app.renderer.width / 2 - deltaX(2.2);
    trees.x = app.renderer.width / 2 - deltaX(1.8);
    cloud2.x = app.renderer.width / 2 - deltaX(1.1);

    //Fade the blurs in and out "psuedo-randomly"
    count += 0.01;
    var count2 = count + 0.95;
    blur1.alpha = (Math.sin(count) * 0.5) + 0.8;
    blur2.alpha = (Math.sin(count2) * 0.5) + 0.8;
}
