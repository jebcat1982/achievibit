var _ = require('lodash');

var breakingBad = {
	name: 'Breaking Bad',
	check: function(pullRequest, shall) {
		if (atLeast80PrecentCommitsFailedBuild(pullRequest)) {

			var achievement = {
				avatar : '//ca.audubon.org/sites/g/files/amh421/f/styles/bean_wysiwyg_full_width/public/blog/wp-content/uploads/2013/09/saul-150x150.jpg?itok=FmjiSkJL',
				name: 'Breaking Bad',
				short: 'Look, let\'s start with some tough love. You two suck at peddling meth. Period.',
				description: 'You merged a Pull Request with 5 or more commits with failing status',
				relatedPullRequest: pullRequest._id
			};

			shall.grant(pullRequest.creator.username, achievement);
		}
	}
};

function atLeast80PrecentCommitsFailedBuild(pullRequest) {
	var failedCommits = 0;
	var totalCommits = pullRequest.commits.length;
	_.forEach(pullRequest.commits, function(commit) {
		var prBuildStatus = commit.statuses['continuous-integration/travis-ci/pr'];
		var pushBuildStatus = commit.statuses['continuous-integration/travis-ci/push'];
		if ((prBuildStatus && _.isEqual(prBuildStatus.state, 'error')) ||
			(pushBuildStatus && _.isEqual(pushBuildStatus.state, 'error'))) {
			failedCommits++;
		}
	});

	return ((failedCommits / totalCommits) * 100) >= 80;
}

module.exports = breakingBad;