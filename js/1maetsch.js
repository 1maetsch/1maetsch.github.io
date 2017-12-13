$(function() {
  const NUM_OF_QUESTIONS = 24;
  var disableNext = false;

  $('#wizard').steps({
    headerTag: 'h2',
    bodyTag: 'section',
    transitionEffect: 'slideLeft',
    titleTemplate: '#title#',

    onFinished: function(event, currentIndex) {
      var answers = '';

      for(var i = 0; i < NUM_OF_QUESTIONS; i++) {
        answers += $('input[name=q' + i + ']:checked').val()
      }

      $.ajax({
        type: 'POST',
        url: 'https://kzgkgcdor0.execute-api.us-west-2.amazonaws.com/PROD/emojicard',
        crossDomain: true,
        dataType: 'json',
        data: JSON.stringify({ 'answers': answers })
      })
      .done(function(response) {
        $('#resultModal a').attr('href', JSON.parse(response.body).url);
        $('#resultModal span').hide();
        $('#resultModal a').show();
      });
      return true;
    },

    onStepChanged(event, currentIndex, priorIndex) {
      disableNext = false;
    },

    onStepChanging: function(event, currentIndex, newIndex) {
      if (newIndex < currentIndex) {
        return true;
      } else {
        if ($('input[name=q' + currentIndex + ']:checked').val() != null) {
          $('#wizard-t-' + currentIndex).text('✔️');
          return true;
        } else {
          return false;
        }
      }
    },

    onFinishing: function(event, currentIndex, newIndex) {
      if ($('input[name=q' + currentIndex + ']:checked').val() != null) {
        $('#wizard-t-' + currentIndex).text('✔️');
        $('#resultModal').modal({
          backdrop: 'static',
          keyboard: false,
          show: true
        });
        return true;
      } else {
        return false;
      }
    }
  });

  $('input:radio').click(function(event) {
    if (!disableNext) {
      disableNext = true;
      if(this.name != 'q' + (NUM_OF_QUESTIONS - 1)) {
        $('#wizard').steps('next');
      } else {
        $('#wizard').steps('finish');
      }
    }
  });
});