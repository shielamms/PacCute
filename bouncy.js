var game = new Phaser.Game(680, 530, Phaser.AUTO, 'canvas');

var start_state = {
    create: function() {
        game.stage.backgroundColor = "#477639";
        var startKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        startKey.onDown.add(this.start, this);

        var style = { font: "50px Arial", fill: "#ffffff", align: "center", stroke: "#ff9860", strokeThickness: 2};
        var style2 = { font: "28px Comic Sans MS", fill: "#ffffff", align: "center", stroke: "#babae0", strokeThickness: 2};
        var x = game.world.width / 2;
        var y = game.world.height / 2;

        var content = "Pac Cute\n";
        var text = game.add.text(x, y-50, content, style);
        text.anchor.setTo(0.5, 0.5); 

        var start_instruction = "Press SPACE to start playing";
        var text2 = game.add.text(x, y+250, start_instruction, style2);
        text2.anchor.setTo(0.5, 6);         
    },

    start: function() {
        game.state.start('gameplay');
    },
};

var init = {
    preload: function() {
        game.load.image('you', 'you.png');
        game.load.image('monster', 'monster1.png');
        game.load.image('monster2', 'monster2.png');
        game.load.image('food', 'food.png');
    },

    create: function() {
        game.stage.backgroundColor = "#101010";
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.monster = game.add.sprite(0, 0, 'monster');
        this.monster2 = game.add.sprite(400, 0, 'monster2');
        this.monster.width = 54;
        this.monster.height = 54;
        this.monster2.width = 54;
        this.monster2.height = 54;

        this.you = game.add.sprite(game.width/2,game.height/2, 'you');
        this.you.width = 55;
        this.you.height = 55;

        this.foods = game.add.group();

        min = 20;
        max = 30;
        rnd_count = min + Math.floor(Math.random() * (max - min + 1));
        this.foods.createMultiple(rnd_count, 'food', 'f', true);

        var piece_count = rnd_count;

        for(var i = 0; i < this.foods.length; i++) {
            rnd_x = 2 + Math.floor(Math.random()*(game.width-35));
            rnd_y = 2 + Math.floor(Math.random()*(game.height-35));

            this.foods.getAt(i).reset(rnd_x, rnd_y);

            this.foods.getAt(i).width = 45;
            this.foods.getAt(i).height = 14;
            this.foods.getAt(i).outOfBoundsKill = true;

            game.physics.enable([this.you, this.foods.getAt(i)], Phaser.Physics.ARCADE);
            game.physics.enable([this.monster, this.foods.getAt(i)], Phaser.Physics.ARCADE);
            game.physics.enable([this.monster2, this.foods.getAt(i)], Phaser.Physics.ARCADE);
            this.foods.getAt(i).body.immovable = true;
        }

        game.physics.enable([this.you, this.monster], Phaser.Physics.ARCADE);
        game.physics.enable([this.you, this.monster2], Phaser.Physics.ARCADE);

        this.monster.body.velocity.setTo(300, 340);
        this.monster2.body.velocity.setTo(-290,400);

        this.you.body.collideWorldBounds = true;
        this.monster.body.collideWorldBounds = true;
        this.monster2.body.collideWorldBounds = true;

        this.monster.body.bounce.setTo(1.006, 1.007);
        this.monster2.body.bounce.setTo(1.007, 1.006);

        controls = game.input.keyboard.createCursorKeys();
    },

    update: function() {
        game.physics.arcade.collide(this.you, this.monster, this.failed, null, this);
        game.physics.arcade.collide(this.you, this.monster2, this.failed, null, this);
        game.physics.arcade.collide(this.monster, this.monster2);

        game.physics.arcade.collide(this.you, this.foods, this.doNothing, null, this);
        game.physics.arcade.collide(this.monster, this.foods);
        game.physics.arcade.collide(this.monster2, this.foods);

        if (controls.up.isDown)
        {
            this.you.body.velocity.y = -350;
        }
        else if (controls.down.isDown)
        {
            this.you.body.velocity.y =  350;
        }
        else if (controls.left.isDown)
        {
            this.you.body.velocity.x = -350;
        }
        else if (controls.right.isDown)
        {
            this.you.body.velocity.x = 350;
        } 
        else
        {
            this.you.body.velocity.setTo(0, 0);
        }

        //if all food objects are taken
        if(this.foods.countLiving() == 0) {
            this.finished();
        }
    },

    doNothing: function(y, f) {
        f.kill();
    },

    failed: function() {
        game.state.start('failed');
    },

    finished: function() {
        game.state.start('success');
    },
};

var failed_state = {
    create: function() {
        game.stage.backgroundColor = "#477639";

        var style = { font: "40px Arial", fill: "#ffffff", align: "center", stroke: "#ff9860", strokeThickness: 2};
        var style2 = {font: "30px Arial", fill: "#ffffff", align: "center", stroke: "#f34762", strokeThickness: 1};
        var x = game.world.width / 2;
        var y = game.world.height / 2;

        var content = "You failed.";
        var content2 = "Press SPACE to play again";
        var text = game.add.text(x, y, content, style);
        text.anchor.setTo(0.5, 0.5);

        game.add.text(x, y+35, content2, style2).anchor.setTo(0.5, 0);

        var restartKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        restartKey.onDown.add(this.restart, this);
    },

    restart: function() {
        game.state.start('gameplay');
    },
};

var success_state = {
    create: function() {
        game.stage.backgroundColor = "#101010";

        var style = { font: "50px Monotype Corsiva", fill: "#ffffff", align: "center", stroke: "#ff9860", strokeThickness: 2};
        var style2 = {font: "28px Arial", fill: "#ffffff", align: "center", stroke: "#f34762", strokeThickness: 2};
        var x = game.world.width / 2;
        var y = game.world.height / 2;

        var content = "CONGRATULATIONS!";
        var content2 = "You finished the game!\nPress SPACE to play again! :)";
        var text = game.add.text(x, y, content, style);
        text.anchor.setTo(0.5, 0.5);

        game.add.text(x, y+35, content2, style2).anchor.setTo(0.5, 0);

        var restartKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        restartKey.onDown.add(this.replay, this);
    },

    replay: function() {
        game.state.start('gameplay');
    },
};

game.state.add('gameplay', init);
game.state.add('start', start_state);
game.state.add('failed', failed_state);
game.state.add('success', success_state);
game.state.start('start');