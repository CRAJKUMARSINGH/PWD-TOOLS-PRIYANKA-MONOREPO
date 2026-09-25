/**
 * Pre-built PWD letter templates.
 * Each template has a title, description, and a factory that returns
 * a pre-filled Letter object (id / timestamps are dummy — only used for
 * the one-click download, never saved to storage).
 *
 * Fields left blank (e.g. toName, letterNumber) are intentional —
 * they show as "–" in the document and the user fills them before sending.
 */

import type { Letter } from "./types";

function today(): string {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
}

function dummy(partial: Partial<Letter>): Letter {
    return {
        id: "tpl",
        type: "reply",
        status: "draft",
        language: "hindi",
        letterNumber: "",
        date: today(),
        toName: "",
        toDesignation: "",
        toOffice: "",
        toNameEn: "",
        toDesignationEn: "",
        toOfficeEn: "",
        subject: "",
        subjectEn: "",
        reference: "",
        referenceEn: "",
        body: "",
        bodyEn: "",
        fromName: "प्रियंका जैन",
        fromDesignation: "अधिशासी अभियंता",
        fromOffice: "सा.नि.वि., जिला खण्ड–II, उदयपुर",
        fromNameEn: "",
        fromDesignationEn: "",
        fromOfficeEn: "",
        cc: "",
        ccEn: "",
        toMany: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...partial,
    };
}

export interface LetterTemplate {
    id: string;
    category: string;       // group heading
    title: string;          // short label shown on card
    description: string;    // one-line description
    icon: string;           // emoji icon
    letter: Letter;
}

export const LETTER_TEMPLATES: LetterTemplate[] = [

    // ── SPECIAL INSPECTION REPORT ─────────────────────────────────────────
    {
        id: "tpl-compliance-report",
        category: "जांच प्रतिवेदन",
        title: "अनुपालना रिपोर्ट भिजवाने बाबत",
        description: "विशेष जांच प्रतिवेदन 2025-26 के आदेशों की बिन्दुवार अनुपालना रिपोर्ट",
        icon: "📋",
        letter: dummy({
            type: "reply",
            subject: "विशेष जांच प्रतिवेदन वर्ष 2025-26 के संबंध में आदेशों की अनुपालना रिपोर्ट भिजवाने बाबत",
            reference: "आपका पत्र क्रमांक एक2(1308)अनु.14/SAR/2025-26/दी-3435 दिनांक 01/07/2026",
            body: `उपरोक्त विषयान्तर्गत एवं प्रासंगिक पत्र के संदर्भ में लेख है कि आपके कार्यालय द्वारा भिजवाए गए विशेष जांच प्रतिवेदन वर्ष 2025-26 की छायाप्रति में उल्लेखित आदेशों/बिन्दुओं की इस कार्यालय द्वारा विस्तृत समीक्षा एवं जांच कर ली गई है। उक्त जांच प्रतिवेदन में उठाए गए आदेशों की बिन्दुवार ठोस एवं पूर्ण प्रथम अनुपालना/टिप्पणी (Compliance Report) इस पत्र के साथ संलग्न कर आगामी आवश्यक कार्यवाही हेतु सादर प्रेषित है।

संलग्नकः बिन्दुवार विस्तृत अनुपालना रिपोर्ट (Detailed Compliance Report)`,
            cc: "मुख्य अभियंता सार्वजनिक निर्माण विभाग, राजस्थान, जयपुर",
        }),
    },

    // ── AUDIT REPLY ───────────────────────────────────────────────────────
    {
        id: "tpl-audit-reply",
        category: "जांच प्रतिवेदन",
        title: "अंकेक्षण आपत्ति उत्तर",
        description: "लेखा परीक्षा आपत्तियों का उत्तर भिजवाने हेतु पत्र",
        icon: "🔍",
        letter: dummy({
            type: "reply",
            subject: "अंकेक्षण प्रतिवेदन वर्ष 2025-26 की आपत्तियों का उत्तर भिजवाने बाबत",
            reference: "महालेखाकार कार्यालय, राजस्थान का पत्र क्रमांक _____ दिनांक _____",
            body: `उपरोक्त विषयान्तर्गत लेख है कि आपके कार्यालय से प्राप्त अंकेक्षण प्रतिवेदन वर्ष 2025-26 की आपत्तियों की इस कार्यालय द्वारा विस्तृत जांच कर ली गई है।

उक्त अंकेक्षण आपत्तियों का बिन्दुवार उत्तर तैयार कर संलग्न किया जा रहा है। आपसे अनुरोध है कि उक्त उत्तर को स्वीकार कर आपत्तियों का निस्तारण करने का श्रम करें।

संलग्नकः अंकेक्षण आपत्तियों का बिन्दुवार उत्तर`,
            cc: "अधीक्षण अभियंता, सा.नि.वि., वृत्त–उदयपुर",
        }),
    },

    // ── WORK ORDER ────────────────────────────────────────────────────────
    {
        id: "tpl-work-order",
        category: "कार्यादेश",
        title: "कार्यादेश पत्र",
        description: "ठेकेदार को कार्य प्रारंभ करने हेतु कार्यादेश",
        icon: "🏗️",
        letter: dummy({
            type: "new",
            subject: "कार्यादेश — _____ कार्य हेतु",
            body: `उपरोक्त विषयान्तर्गत लेख है कि आपकी निविदा दिनांक _____ को स्वीकृत की गई है।

आपको इस पत्र द्वारा सूचित किया जाता है कि आप उक्त कार्य को अनुबंध की शर्तों के अनुसार दिनांक _____ से प्रारंभ करें तथा निर्धारित अवधि _____ माह में पूर्ण करें।

कार्य की गुणवत्ता एवं समयबद्धता सुनिश्चित करना आपकी जिम्मेदारी रहेगी।`,
            cc: "अधीक्षण अभियंता, सा.नि.वि., वृत्त–उदयपुर\nकनिष्ठ अभियंता (सम्बन्धित), इस कार्यालय",
        }),
    },

    // ── SHOW CAUSE NOTICE ─────────────────────────────────────────────────
    {
        id: "tpl-show-cause",
        category: "नोटिस",
        title: "कारण बताओ नोटिस",
        description: "ठेकेदार/कर्मचारी को कारण बताओ नोटिस",
        icon: "⚠️",
        letter: dummy({
            type: "new",
            subject: "कारण बताओ नोटिस — अनुबंध शर्तों के उल्लंघन बाबत",
            body: `उपरोक्त विषयान्तर्गत लेख है कि आपके द्वारा _____ कार्य में अनुबंध की शर्तों का पालन नहीं किया जा रहा है। कार्य की प्रगति अत्यंत धीमी है एवं निर्धारित समय-सीमा का उल्लंघन हो रहा है।

अतः आपसे अनुरोध है कि इस नोटिस की प्राप्ति से 07 (सात) दिवस के भीतर अपना स्पष्टीकरण प्रस्तुत करें, अन्यथा आपके विरुद्ध अनुबंध की शर्तों के अनुसार आवश्यक कार्यवाही की जाएगी जिसकी जिम्मेदारी आपकी स्वयं की रहेगी।`,
            cc: "अधीक्षण अभियंता, सा.नि.वि., वृत्त–उदयपुर",
        }),
    },

    // ── EXTENSION OF TIME ─────────────────────────────────────────────────
    {
        id: "tpl-time-extension",
        category: "कार्यादेश",
        title: "समय विस्तार स्वीकृति",
        description: "ठेकेदार को कार्य पूर्ण करने हेतु समय विस्तार की स्वीकृति",
        icon: "📅",
        letter: dummy({
            type: "new",
            subject: "_____ कार्य हेतु समय विस्तार स्वीकृति बाबत",
            body: `उपरोक्त विषयान्तर्गत लेख है कि आपके द्वारा समय विस्तार हेतु प्रस्तुत आवेदन पर विचार किया गया।

विभागीय स्तर पर परीक्षण उपरान्त उक्त कार्य को _____ दिनांक तक पूर्ण करने हेतु _____ माह का समय विस्तार स्वीकृत किया जाता है। यह समय विस्तार निःशुल्क प्रदान किया जा रहा है।

आप उक्त अवधि में कार्य पूर्ण सुनिश्चित करें अन्यथा अनुबंध की शर्तानुसार अर्थदण्ड आरोपित किया जाएगा।`,
            cc: "अधीक्षण अभियंता, सा.नि.वि., वृत्त–उदयपुर\nकनिष्ठ अभियंता (सम्बन्धित), इस कार्यालय",
        }),
    },

    // ── INFORMATION REQUEST ───────────────────────────────────────────────
    {
        id: "tpl-info-request",
        category: "सूचना पत्र",
        title: "सूचना/विवरण मांगने हेतु",
        description: "अधीनस्थ कार्यालयों से सूचना या विवरण मांगने हेतु पत्र",
        icon: "📊",
        letter: dummy({
            type: "new",
            subject: "_____ सम्बन्धी सूचना/विवरण उपलब्ध कराने बाबत",
            body: `उपरोक्त विषयान्तर्गत लेख है कि इस कार्यालय को _____ सम्बन्धी विस्तृत जानकारी की आवश्यकता है।

अतः आपसे अनुरोध है कि निम्नलिखित बिन्दुओं पर विवरण निर्धारित प्रपत्र में दिनांक _____ तक इस कार्यालय को उपलब्ध कराएं:

1. _____
2. _____
3. _____

उक्त सूचना समय पर न भेजने पर उत्तरदायित्व आपका होगा।`,
            cc: "",
        }),
    },
];

/** Group templates by category */
export function groupTemplates(templates: LetterTemplate[]): Record<string, LetterTemplate[]> {
    return templates.reduce<Record<string, LetterTemplate[]>>((acc, t) => {
        (acc[t.category] ??= []).push(t);
        return acc;
    }, {});
}
