var game = new Phaser.Game(400, 490, Phaser.AUTO, 'phaser-area');
var global = Global(new EventBroker());
game.state.add('start', StartState());
game.state.add('main', StageState());
game.state.start('start', true, false, global);