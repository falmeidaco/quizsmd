(function($) {
    /* Classe QuizSMD */
    var QuizSMD = function () {

        /* MODELO DE PERGUNTA E RESPOSTA
        {
            "text":"",
            "image":"",
            "options":[""]
            "answer":0
        }
        */
        var current_questions;

        var config = {
            default_questions:[
                {
                    "enabled": true,
                    "text": "Qual a capital do Ceará?",
                    "image": "",
                    "options": ["São Luís", "Fortaleza", "Maceió", "Rio de Janeiro"],
                    "answer": 2
                },
                {
                    "enabled": true,
                    "text": "Quantos dias tem 1 ano bisexto?",
                    "image": "",
                    "options": ["366", "365", "364", "363"],
                    "answer": 1
                },
                {
                    "enabled": true,
                    "text": "Quantos bits tem 32 bytes",
                    "image": "",
                    "options": ["16", "1024", "256", "64", "128"],
                    "answer": 3
                }
            ],
        };

        this.getQuestions = function () {
            return current_questions;
        }

        this.init = function () {
            //Check for questions
            if (window.localStorage) {
                if (window.localStorage.getItem("_quizsmd.config") !== null) {
                    current_questions = JSON.parse(window.localStorage.getItem("_quizsmd"));
                } else {
                    current_questions = config.default_questions;
                    window.localStorage.setItem("_quizsmd.config", JSON.stringify(current_questions));
                }
            }
        };

    }

    var quizsmd = window.quizsmd = new QuizSMD();

}(jQuery));
