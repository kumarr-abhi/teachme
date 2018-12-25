export class StrengthColorMap{
    private static strengthColor= {
        'strength_phonetic': '#E885FD',
        'strength_pronunciation': '#FDD657',
        'strength_tpr': '#F9690A',
        'strength_behavior_management': '#FF9999',
        'strength_early_childhood': '#FF9999',
        'strength_writing': '#9B9B9B',
        'strength_english_test_prep': '#FD7676',
        'strength_grammar_training': '#2AB6FB',
        'strength_conversation_training': '#B8E986',
        'strength_personalized_lesson': '#B8E986'
    }
    public static getStrengthColor(key: string){
        if(this.strengthColor.hasOwnProperty(key))
            return this.strengthColor[key];
    }
}