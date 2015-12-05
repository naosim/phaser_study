var Score = function(score) {
	return {
		value: score,
		add: function(addValue) {
			return Score(score + addValue);
		}
	};
};

var Global = function(events) {
	var _score = Score(0);
	var scoreEvent = EventBrokerWrapper(events, 'score');
	
	
	return {
		getScore: function() {
			return _score;
		},
		setScore: function(score) {
			_score = score;
			scoreEvent.publish(_score);
		},
		getScoreEvent: function() {
			return scoreEvent;
		}
	}
}