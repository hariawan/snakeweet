$(document).ready(function() {
    var intro_html      = '<button type="button" id="start_button" title="Let\'s get started!">Start</button>',
        quiz_html       = '<canvas id="canvas" width="500" height="400"></canvas>',
        outro_html      = '<div id="share"></div>',
        replay_html     = '<button type="button" id="replay_button" title="Gimme more!">Again?</button>',
        placeholder     = $('#snake_container').append(intro_html, quiz_html, outro_html, replay_html);

    outro           = $('#share');
    canvas_game     = $('#canvas');
    canvas_game.hide();
    replay_button   = $('#replay_button');
    replay_button.hide();
    start_button    = $('#start_button');
    start_button.click(startQuiz);

    function startQuiz() {
        start_button.hide();
        canvas_game.show();
    }

    //Canvas stuff
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext("2d");
    var w = $("#canvas").width();
    var h = $("#canvas").height();

    //Lets save the cell width in a variable for easy control
    var cw = 10;
    var d;
    var food;
    var score;

    //Lets create the snake now
    var snake_array; //an array of cells to make up the snake

    function init() {
        d = "right"; //default direction
        create_snake();
        create_food(); //Now we can see the food particle
        //finally lets display the score
        score = 0;
        
        //Lets move the snake now using a timer which will trigger the paint function
        //every 60ms
        if(typeof game_loop != "undefined") clearInterval(game_loop);
        game_loop = setInterval(paint, 50);
    }
    init();

    function create_snake() {
        var length = 5; //Length of the snake
        snake_array = []; //Empty array to start with
        for(var i = length-1; i>=0; i--) {
            //This will create a horizontal snake starting from the top left
            snake_array.push({x: i, y:0});
        }
    }

    //Lets create the food now
    function create_food() {
        food = {
            x: Math.round(Math.random()*(w-cw)/cw), 
            y: Math.round(Math.random()*(h-cw)/cw), 
        };
        //This will create a cell with x/y between 0-44
        //Because there are 45(450/10) positions accross the rows and columns
    }

    //Lets paint the snake now
    function paint() {
        //To avoid the snake trail we need to paint the BG on every frame
        //Lets paint the canvas now
        ctx.fillStyle = "#d9d9c3";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "#d9d9c3";
        ctx.strokeRect(0, 0, w, h);

        //The movement code for the snake to come here.
        //The logic is simple
        //Pop out the tail cell and place it infront of the head cell
        var nx = snake_array[0].x;
        var ny = snake_array[0].y;
        //These were the position of the head cell.
        //We will increment it to get the new head position
        //Lets add proper direction based movement now
        if(d == "right") nx++;
        else if(d == "left") nx--;
        else if(d == "up") ny--;
        else if(d == "down") ny++;
        
        //Lets add the game over clauses now
        //This will restart the game if the snake hits the wall
        //Lets add the code for body collision
        //Now if the head of the snake bumps into its body, the game will restart
        if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array)) {
            //restart game
            init();
            //Lets organize the code a bit now.
            return;
        }
        
        //Lets write the code to make the snake eat the food
        //The logic is simple
        //If the new head position matches with that of the food,
        //Create a new head instead of moving the tail
        if(nx == food.x && ny == food.y) {
            var tail = {x: nx, y: ny};
            score++;
            //Create new food
            create_food();
        } else {
            var tail = snake_array.pop(); //pops out the last cell
            tail.x = nx; tail.y = ny;
        }
        //The snake can now eat the food.
        
        snake_array.unshift(tail); //puts back the tail as the first cell
        
        for(var i = 0; i < snake_array.length; i++) {
            var c = snake_array[i];
            //Lets paint 10px wide cells
            paint_cell(c.x, c.y);
        }
        
        //Lets paint the food
        paint_cell(food.x, food.y);
        //Lets paint the score
        var score_text = "Score: " + score;
        if (score === 30) {
            init();
            game_close();
        }
        ctx.font="13px 'Aldrich', sans-serif";
        ctx.fillText(score_text, 5, h-5);
    }

    function game_close() {
        var share_box   = $('#share'),
        tweet_content   = 'Woohoo! I just reached 30 point in #Snakeweet pic.twitter.com/Gyc3zphW',
        twitter_html    = '<a href="https://twitter.com/share" class="twitter-share-button" data-url="http://www.hariawan.com/snakeweet/" data-text="' + tweet_content + '" data-count="vertical">Tweet</a><script type="text/javascript" src="//platform.twitter.com/widgets.js"></script>',
        plus_html       = '<div class="g-plusone" data-size="tall" data-href="http://www.hariawan.com/snakeweet/index.html"></div><script type="text/javascript">(function() {var po = document.createElement(\'script\'); po.type = \'text/javascript\'; po.async = true;po.src = \'https://apis.google.com/js/plusone.js\';var s = document.getElementsByTagName(\'script\')[0]; s.parentNode.insertBefore(po, s);})();</script>',
        facebook_html   = '<iframe src="//www.facebook.com/plugins/like.php?href=http%3A%2F%2Fwww.hariawan.com%2Fsnakeweet%2Findex.html&amp;send=false&amp;layout=box_count&amp;width=50&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font=lucida+grande&amp;height=90&amp;appId=251751164868646" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:50px; height:90px;" allowTransparency="true"></iframe>';

        share_box.append(twitter_html, plus_html, facebook_html);
        share_box.children(':not(h2)').wrap('<div class="share_item">');
        canvas_game.hide();
        outro.show();
        replay_button    = $('#replay_button');
        replay_button.show();
        replay_button.click(startQuiz);
    }

    //Lets first create a generic function to paint cells
    function paint_cell(x, y) {
        ctx.fillStyle = "#91856a";
        ctx.fillRect(x*cw, y*cw, cw, cw);
        ctx.strokeStyle = "#91856a";
        ctx.strokeRect(x*cw, y*cw, cw, cw);
    }

    function check_collision(x, y, array) {
        //This function will check if the provided x/y coordinates exist
        //in an array of cells or not
        for(var i = 0; i < array.length; i++) {
            if(array[i].x == x && array[i].y == y)
             return true;
        }
        return false;
    }

    //Lets add the keyboard controls now
    $(document).keydown(function(e) {
        var key = e.which;
        //We will add another clause to prevent reverse gear
        if(key == "37" && d != "right") d = "left";
        else if(key == "38" && d != "down") d = "up";
        else if(key == "39" && d != "left") d = "right";
        else if(key == "40" && d != "up") d = "down";
        //The snake is now keyboard controllable
    })
})