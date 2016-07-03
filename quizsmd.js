function createNode (node) {
    var i, data, attribute, nodeContent, nodeElement = document.createElement(node.type);
    //Attributes
    if (node.hasOwnProperty('attr')) {
        for (attribute in node.attr) {
            if (node.attr.hasOwnProperty(attribute)) {
                if (attribute === 'dataset') {
                    for (data in node.attr[attribute]) {
                        if (node.attr[attribute].hasOwnProperty(data)) {
                            nodeElement.dataset[data] = node.attr[attribute][data];
                        }
                    }
                } else if (node.type === 'input' && attribute === 'value') {
                    nodeElement.value = node.attr[attribute];
                } else {
                    if (typeof node.attr[attribute] === "object") {
                        if (node.attr[attribute].condition) {
                            nodeElement.setAttribute(attribute, node.attr[attribute].value);
                        }
                    } else {
                        nodeElement.setAttribute(attribute, node.attr[attribute]);
                    }
                }
            }
        }
    }
    //Content
    if (node.hasOwnProperty('content')) {
        if (typeof node.content === "string") {
            //nodeContent = document.createTextNode(node.content);
            //nodeElement.appendChild(nodeContent);
            nodeElement.innerHTML = node.content;
        } else if (typeof node.content === "object") {
            if (node.content.constructor === Array) {
                for (i = 0; i < node.content.length; i += 1) {
                    nodeContent = createNode(node.content[i]);
                    nodeElement.appendChild(nodeContent);
                }
            } else {
                nodeContent = createNode(node.content);
                nodeElement.appendChild(nodeContent);
            }
        }
    }
    //Events
    if (node.hasOwnProperty('events')) {
        for (event in node.events) {
            if (node.events.hasOwnProperty(event)) {
                nodeElement.addEventListener(event, node.events[event], false);
            }
        }
    }
    return nodeElement;
}

(function($) {
    /* Classe QuizSMD */
    var QuizSMD = window.QuizSMD = function () {

        var current_questions, config, $this = this;

        config = {
            default_questions:[
                {
                    "enabled": true,
                    "text": "Qual a capital do Ceará?",
                    "image": "",
                    "options": [
                        {
                            "text":"São Paulo",
                            "image":""
                        },
                        {
                            "text":"Fortaleza",
                            "image":""
                        },
                        {
                            "text":"Natal",
                            "image":""
                        },
                        {
                            "text":"Espírito Santo",
                            "image":""
                        }
                    ],
                    "answer": 2
                },
                {
                    "enabled": true,
                    "text": "Quantos dias tem 1 ano bisexto?",
                    "image": "",
                    "options": [
                        {
                            "text":"366",
                            "image":""
                        },
                        {
                            "text":"365",
                            "image":""
                        },
                        {
                            "text":"333",
                            "image":""
                        },
                        {
                            "text":"666",
                            "image":""
                        }
                    ],
                    "answer": 1
                }
            ],
        };

        this.resetQuestions = function () {
            $this.updateQuestions(config.default_questions);
        };

        this.getQuestions = function () {
            return current_questions;
        };

        this.updateQuestions = function (questions) {
            current_questions = questions;
            window.localStorage.setItem("_quizsmd.questions", JSON.stringify(current_questions));
        };

        this.getTemplateQuestion = function () {
            return {
                "enabled": true,
                "text": "Texto da pergunta",
                "image": "",
                "options": [
                    {
                        "text":"Texto da opção",
                        "image":"http://dummyimage.com/600x400/000/fff"
                    }
                ],
                "answer": 0
            }
        };

        this.getResults = function (questions, answers) {
            var i, result  = {};
            result.total_questions = questions.length;
            result.correct = [];
            result.wrong = [];
            for (i = 0; i < questions.length; i +=1 ) {
                if (questions[i].answer == answers[i]) {
                    result.correct.push(answers[i]);
                } else {
                    result.wrong.push(answers[i]);
                }
            }
            return result;
        };

        this.init = function () {
            //Check for questions
            if (window.localStorage) {
                if (window.localStorage.getItem("_quizsmd.questions") !== null) {
                    current_questions = JSON.parse(window.localStorage.getItem("_quizsmd.questions"));
                } else {
                    current_questions = config.default_questions;
                    window.localStorage.setItem("_quizsmd.questions", JSON.stringify(current_questions));
                }
            }
        };

    }

}(jQuery));
