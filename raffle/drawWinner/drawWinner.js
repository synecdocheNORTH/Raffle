(function () {
    if (Meteor.isClient) {
        function drawWinner() {
            var winner = DRAW_LOGIC.drawUser(this.participants);
            if (!winner) {
                return;
            }

            var winnerName = Users.findOne(winner.userId).name;

            // Play awesome drum roll to get people excited
            var audio = new Audio('/drumroll.mp3');
            var that = this;
            audio.addEventListener('ended', function() {
                that.winners.push(winner);
                Raffles.update({_id: that._id}, {
                    $set: {
                        winners: that.winners,
                        participants: that.participants
                    }
                });

                var winnerAnnouncementPopupElement = $('#winner-announcement-popup');
                winnerAnnouncementPopupElement.html('<h1>' + winnerName + '</h1>');
                if (winnerAnnouncementPopupElement.length) {
                    $.magnificPopup.open({
                        items: {
                            src: winnerAnnouncementPopupElement
                        },
                        type: 'inline',
                        closeOnContentClick: true
                    });
                }
            }, false);

            audio.play(); // Will update users and show winner after it is done
        }

        Template.drawWinner.events({
            'click #drawWinnerButton': drawWinner
        });
    }
})();