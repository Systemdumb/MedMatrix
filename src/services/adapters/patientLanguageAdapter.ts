import { Language } from '../../types';

/**
 * Patient Language Presentation Adapter
 * Maps internal engine codes (barriers, interventions, confidence scores)
 * into compassionate, plain natural language in English and Hindi.
 */

export function getGreeting(name: string, lang: Language = 'en'): string {
  const hour = new Date().getHours();
  const firstName = name ? name.split(' ')[0] : 'there';

  if (lang === 'hi') {
    if (hour < 12) return `सुप्रभात, ${firstName}`;
    if (hour < 17) return `नमस्कार, ${firstName}`;
    return `शुभ संध्या, ${firstName}`;
  } else {
    if (hour < 12) return `Good morning, ${firstName}`;
    if (hour < 17) return `Good afternoon, ${firstName}`;
    return `Good evening, ${firstName}`;
  }
}

export function getBarrierPatientDescription(barrierCategory: string, lang: Language = 'en'): string {
  const normalized = (barrierCategory || '').toUpperCase();

  const map: Record<string, { en: string; hi: string }> = {
    FORGETFULNESS: {
      en: 'You sometimes forget your evening medicine.',
      hi: 'आप कभी-कभी अपनी शाम की दवा भूल जाते हैं।',
    },
    EVENING_ROUTINE_DISRUPTION: {
      en: 'Your evening routine changes often.',
      hi: 'आपकी शाम की दिनचर्या में बार-बार बदलाव होता है।',
    },
    SCHEDULE_DISRUPTION: {
      en: 'Your daily routine changes often.',
      hi: 'आपकी दैनिक दिनचर्या अक्सर बदलती रहती है।',
    },
    REFILL_RISK: {
      en: 'You may be running low on this medicine.',
      hi: 'आपकी दवा की खुराक समाप्त होने वाली है।',
    },
    MEDICATION_AVAILABILITY: {
      en: 'You may be running low on this medicine.',
      hi: 'आपकी दवा समाप्त होने वाली है।',
    },
    SUPPLY_DEPLETION: {
      en: 'Your medication supply is almost empty.',
      hi: 'आपकी दवा का स्टॉक लगभग खत्म हो गया है।',
    },
    HARDWARE_FAILURE: {
      en: "We couldn't confirm the medicine was dispensed.",
      hi: 'दवा बॉक्स से निकलने की पुष्टि नहीं हो सकी।',
    },
    DEVICE_FAILURE: {
      en: "We couldn't confirm the medicine was dispensed.",
      hi: 'स्मार्ट बॉक्स से दवा निकलने की पुष्टि नहीं हो सकी।',
    },
    SIDE_EFFECT_CONCERN: {
      en: 'You feel discomfort or side effects from this medicine.',
      hi: 'आप इस दवा से कुछ अस्वस्थ महसूस कर रहे हैं।',
    },
    TRAVEL_OR_ROUTINE_DISRUPTION: {
      en: 'Travel or busy days interfere with dose timing.',
      hi: 'यात्रा या व्यस्त दिन के कारण दवा का समय छूट जाता है।',
    },
  };

  if (map[normalized]) {
    return lang === 'hi' ? map[normalized].hi : map[normalized].en;
  }

  return lang === 'hi'
    ? 'आपकी दवा की समयसारणी में हल्का बदलाव देखा गया है।'
    : 'We noticed a slight variation in your medication timing.';
}

export function getInterventionPatientAction(interventionType: string, lang: Language = 'en'): string {
  const normalized = (interventionType || '').toUpperCase();

  const map: Record<string, { en: string; hi: string }> = {
    ADAPTIVE_REMINDER: {
      en: "We'll remind you 30 minutes earlier today.",
      hi: 'आज हम आपको 30 मिनट पहले याद दिलाएंगे।',
    },
    SCHEDULE_AWARE_REMINDER: {
      en: "We'll adjust reminder timing to match your routine.",
      hi: 'हम आपकी दिनचर्या के अनुसार याद दिलाने का समय बदलेंगे।',
    },
    CAREGIVER_ESCALATION: {
      en: "We'll ask your family member for help if the medicine is missed.",
      hi: 'दवा छूटने पर हम आपके परिवार के सदस्य को सूचित करेंगे।',
    },
    CAREGIVER_NOTIFICATION: {
      en: "We'll share a friendly update with your caregiver.",
      hi: 'हम आपके देखभालकर्ता को एक अपडेट भेजेंगे।',
    },
    VOICE_REMINDER_EN: {
      en: "We'll play a voice reminder for you.",
      hi: 'हम आपको बोलकर याद दिलाएंगे।',
    },
    VOICE_REMINDER_HI: {
      en: "We'll play a spoken Hindi voice reminder.",
      hi: 'हम आपको हिंदी में बोलकर याद दिलाएंगे।',
    },
    REFILL_REMINDER: {
      en: "We'll remind you to refill your prescription soon.",
      hi: 'हम आपको दवा दोबारा खरीदने का याद दिलाएंगे।',
    },
    REFILL_PROMPT: {
      en: "We'll help you request a refill for this medication.",
      hi: 'हम आपकी दवा को दोबारा ऑर्डर करने में मदद करेंगे।',
    },
    DEVICE_TROUBLESHOOT: {
      en: "We'll guide you to check your pill box.",
      hi: 'हम आपके पिल बॉक्स की जांच करने में मदद करेंगे।',
    },
  };

  if (map[normalized]) {
    return lang === 'hi' ? map[normalized].hi : map[normalized].en;
  }

  return lang === 'hi'
    ? 'हम आपको सही समय पर एक उपयोगी रिमाइंडर भेजेंगे।'
    : "We'll send a helpful reminder at your preferred time.";
}

export function getProgressTrendDescription(score: number, lang: Language = 'en'): string {
  if (score >= 80) {
    return lang === 'hi'
      ? 'आपकी दवा लेने की दिनचर्या में लगातार सुधार हो रहा है।'
      : 'Your medication routine is becoming more consistent.';
  }
  if (score >= 60) {
    return lang === 'hi'
      ? 'आप अच्छा प्रयास कर रहे हैं! समय पर रिमाइंडर आपको ट्रैक पर रखेंगे।'
      : 'Good progress this week. Friendly reminders can help keep you on track.';
  }
  return lang === 'hi'
    ? 'हम आपकी दवाएं समय पर लेने में हर कदम पर सहायता के लिए मौजूद हैं।'
    : 'We are here to support your health routine with gentle reminders.';
}
