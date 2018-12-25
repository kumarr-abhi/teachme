export class StrengthMap{
    private static strength = {
        'strength_phonetic': 'Phonetics / Phonics Training',
        'strength_pronunciation': 'Pronunciation Training',
        'strength_tpr': 'Total Physical Response',
        'strength_behavior_management': 'Behavior Management',
        'strength_early_childhood': 'Early Childhood Education',
        'strength_writing': 'Writing',
        'strength_english_test_prep': 'English Test Prep',
        'strength_grammar_training': 'Grammar Training',
        'strength_conversation_training': 'Conversation Training',
        'strength_personalized_lesson': 'Personalized Lesson Planning',
    };

    public static getStrength(key: string){
        if(this.strength.hasOwnProperty(key))
            return this.strength[key];
    }
}