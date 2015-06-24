jQuery.fn.instaQuiz = function(quiz){
    function createQuestionElements(question){
        jQuery.extend(question, jQuery.extend({
                label: 'Question ' + questionNumber.toString(),
                choices: ['a', 'b', 'c', 'd'],
                answer: "",
                question: "aquestion",
                type: 'multiple',
                name: questionNumber.toString(),
                required: false
            },
            question));

        var questionContainer = jQuery('<div class="quiz-question form-group"><div>');

        questionContainer.append(jQuery("<h3></h3>").text(question.label));

        if(question.required){
            questionContainer.addClass("required");
            questionContainer.find('h3').append('<span style="color: red">*</span>');
        }

        switch(question.type){
            case 'multiple':
                if(question.choices.indexOf(question.answer) == -1){
                    question.choices.push(question.answer);
                }

                question.choices.sort(function(){return Math.random() -.5;});

                question.choices.forEach(function(choice){
                    questionContainer.append(jQuery('<div class="checkbox"><label><input type="radio" value="' + choice + '" name="' + question.name.toString() + '">' + choice.toString() + '</label></div>'));
                });
                break;
            case 'yesno':
                ['Yes', 'No'].forEach(function(choice){
                    questionContainer.append(jQuery('<div class="checkbox"><label><input type="radio" value="' + choice + '" name="' + question.name.toString() + '">' + choice.toString() + '</label></div>'));
                });
                break;
            case 'text':
                questionContainer.append(jQuery('<input class="form-control" type="text" name="' + question.name.toString() + '">'));
                break;
        }

        question.container = questionContainer;

        return questionContainer;
    }

    function scoreQuiz($quizDiv, quiz){

        var complete = true;
        var wrong = 0;
        var scoredQuestions = 0;
        quiz.questions.forEach(function(question){
            var value = '';

            switch(question.type){
                case 'multiple':
                case 'yesno':
                    value = question.container.find(":checked").val();
                    break;
                case 'text':
                    value = question.container.find("input[type=text]").val();
                    break;
            }

            if((value == undefined || value == '') && question.required){
                question.container.addClass('has-error');
                complete = false;
            } else {
                question.container.addClass('has-success');
            }

            if(question.answer != '' && question.answer != value){
                wrong++;
            }

            if(question.answer != ''){
                scoredQuestions++
            }
        });

        $quizDiv.find('[name=score]').val(100 - wrong * 1.0 / scoredQuestions * 100);

        if(!complete){
            alert(quiz.requiredPrompt);
            return false;
        }
    }

    var questionNumber = 1;
    var newElements = [];

    var quiz = jQuery.extend({
        submitLabel: "Score Quiz",
        title: "A Quiz",
        questions: [],
        requiredPrompt: "Whoops, looks like you missed a required question.",
        action: 'post',
        submissionUrl: ''
    }, quiz);


    quiz.questions.forEach(function (question){
        newElements.push(createQuestionElements(question));
        questionNumber++;
    });

    var submitButton = jQuery('<button type="submit" class="btn btn-primary"></button>').text(quiz.submitLabel);

    var $quizDiv = this;
    submitButton.on('click', function(){
        return scoreQuiz($quizDiv, quiz);

    });

    newElements.push(submitButton);

    this.append(jQuery('<form method="' + quiz.action + '", action="' + quiz.submissionUrl + '"><input type="hidden" name="score" value=""></form>').append(jQuery('<h1></h1>').text(quiz.title)).append(newElements));

    return this;



};