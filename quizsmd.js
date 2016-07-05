function createNode (node) {
    var i, data, attribute, nodeContent, nodeElement = (node.type === "img") ? new Image() : document.createElement(node.type);
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
    if (node.hasOwnProperty('content') && node.type !== "img") {
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
                        }
                    ],
                    "answer": 2
                },
                {
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
                        }
                    ],
                    "answer": 1
                }
            ],
        };

        this.getDefaultOptionImage = function () {
            return 'assets/default-option_image.png'
        }

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
                "text": "Texto da pergunta",
                "image": "",
                "options": [
                    {
                        "text":"Texto da opção 1",
                        "image":""
                    },
                    {
                        "text":"Texto da opção 2",
                        "image":""
                    },
                    {
                        "text":"Texto da opção 3",
                        "image":""
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

        this.exportQuestions = function (questions) {
            var url, blob, json,
                fileName = "quiz-data.json",
                a = document.createElement('a');

            json = JSON.stringify(questions);
            blob = new Blob([json], {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);

            a.href = url;
            a.download = fileName;
            a.click();

            window.URL.revokeObjectURL(url);
        };

        this.parseFile = function (data) {
            var i, j, jsonObj, is_valid, result = [];
            try {
                jsonObj = JSON.parse(data);
                if (jsonObj.constructor === Array) {
                    if (jsonObj.length > 0) {
                        for (i = 0; i < jsonObj.length; i += 1) {
                            if (typeof jsonObj[i].text === "string" && typeof jsonObj[i].answer === "number" && typeof jsonObj[i].options === "object") {
                                for (j = 0; j < jsonObj[i].options.length; j += 1) {
                                    if (typeof jsonObj[i].options[j].text === "string" && typeof jsonObj[i].options[j].image === "string") {
                                        continue;
                                    } else {
                                        break;
                                    }
                                }
                                result.push(jsonObj[i]);
                            }
                        }
                    } else {
                        is_valid = false;
                    }
                } else {
                    is_valid = false;
                }
            } catch (e) {
                return false;
            }
            if (result.length > 1) {
                return result;
            } else {
                return false;
            }
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
