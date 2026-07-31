import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Printer, RefreshCw, FileDown } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

type TemplateType = 'bg-verification' | 'bg-extension' | 'bg-bank-extension';

type BankCommunicationData = {
  officeNameHi: string;
  departmentNameHi: string;
  letterNo: string;
  letterDate: string;

  // BG Verification (to Bank)
  bankName: string;
  bankBranch: string;
  bgNumber: string;
  bgDate: string;
  bgAmount: string;
  bgAmountWords: string;
  contractorName: string;
  contractorAddress: string;

  // BG Extension (to Contractor)
  contractorClass: string;
  projectName: string;
  bgExpiryDate: string;
  extensionDays: string;
  ccBankName: string;
  ccBankAddress: string;

  // BG Bank Extension (to Bank directly)
  bgNewExpiryDate: string;
  ccContractorName: string;
  ccContractorAddress: string;

  signatoryName: string;
  signatoryDesignation: string;
};

const defaultData: BankCommunicationData = {
  officeNameHi: 'कार्यालय अधिशाषी अभियन्ता',
  departmentNameHi: 'सार्वजनिक निर्माण विभाग जिला खण्ड द्वितीय उदयपुर।',
  letterNo: '',
  letterDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }),

  bankName: 'HDFC Bank',
  bankBranch: 'उदयपुर',
  bgNumber: 'C73GT02251250002',
  bgDate: '05.05.2025',
  bgAmount: '8,43,734.00',
  bgAmountWords: 'आठ लाख तियालीस हजार सात सौ चौतीस',
  contractorName: 'रचना कन्स्ट्रक्शन',
  contractorAddress: '8 नवरत्न काम्प्लेक्स बेदला रोड़ उदयपुर',

  contractorClass: 'ए क्लास संवेदक',
  projectName:
    'Construction of various Non Patchable/Missing Link Roads Package No. Rj-32/NP/ML/2025-26/02',
  bgExpiryDate: '31.05.2026',
  extensionDays: '3',
  ccBankName: 'यूनियन बैंक ऑफ इण्डिया',
  ccBankAddress: 'कल्पतरु अपार्टमेन्ट, न्यू फतेहपुरा, उदयपुर',

  bgNewExpiryDate: '30.09.2026',
  ccContractorName: 'रचना कन्स्ट्रक्शन',
  ccContractorAddress: '8 नवरत्न काम्प्लेक्स बेदला रोड़ उदयपुर',

  signatoryName: 'अनिल खिच्ची',
  signatoryDesignation: 'अधिशाषी अभियन्ता',
};

const TEMPLATE_OPTIONS: { value: TemplateType; labelHi: string; labelEn: string; desc: string }[] = [
  {
    value: 'bg-verification',
    labelHi: 'बैंक गारन्टी सत्यापन पत्र',
    labelEn: 'BG Verification Letter',
    desc: 'बैंक प्रबन्धक को BG सत्यापित कराने हेतु पत्र',
  },
  {
    value: 'bg-extension',
    labelHi: 'बैंक गारन्टी वैधता बढ़ाने का पत्र',
    labelEn: 'BG Validity Extension Letter',
    desc: 'ठेकेदार को BG अवधि बढ़ाने हेतु पत्र (बैंक को प्रतिलिपि)',
  },
  {
    value: 'bg-bank-extension',
    labelHi: 'बैंक को BG वैधता विस्तार हेतु पत्र',
    labelEn: 'BG Extension Request to Bank',
    desc: 'बैंक प्रबन्धक को सीधे BG की वैधता बढ़ाने हेतु अनुरोध पत्र',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function esc(v: string): string {
  return (v || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>');
}

function buildVerificationHtml(d: BankCommunicationData): string {
  return `
  <div style="text-align:center;margin-bottom:16px;">
    <div style="font-weight:bold;font-size:14px;">${esc(d.officeNameHi)}</div>
    <div style="font-weight:bold;font-size:13px;margin-top:2px;">${esc(d.departmentNameHi)}</div>
  </div>
  <div style="display:flex;justify-content:space-between;margin-bottom:16px;font-size:12px;">
    <div><strong>क्रमांक:-</strong> ${esc(d.letterNo) || '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'}</div>
    <div><strong>दिनांक:-</strong> ${esc(d.letterDate)}</div>
  </div>
  <div style="margin-bottom:16px;">
    <div><strong>श्रीमान प्रबन्धक महोदय,</strong></div>
    <div>${esc(d.bankName)} ${esc(d.bankBranch)}</div>
  </div>
  <div style="margin-bottom:8px;"><strong>विषय:-</strong> बैंक गारन्टी सत्यापित कराने बाबत।</div>
  <div style="margin-bottom:16px;"><strong>सन्दर्भ:-</strong> बैंक गारन्टी संख्या ${esc(d.bgNumber)} दिनांक ${esc(d.bgDate)}</div>
  <p style="text-align:justify;margin-bottom:16px;line-height:1.8;">
    महोदय,
  </p>
  <p style="text-align:justify;margin-bottom:16px;line-height:1.8;">
    उपरोक्त विषयान्तर्गत निवेदन है कि आपके द्वारा जारी बैंक गारन्टी संख्या
    <strong>${esc(d.bgNumber)}</strong> दिनांक <strong>${esc(d.bgDate)}</strong>
    RS. <strong>${esc(d.bgAmount)}</strong> (${esc(d.bgAmountWords)} मात्र)
    मैसर्स <strong>${esc(d.contractorName)}</strong> ${esc(d.contractorAddress)} के नाम जारी की गई है।
    उक्त बैंक गारन्टी की छाया प्रति संलग्न कर भिजवाई जा रही है।
    कृपया सत्यापित कराने का कष्ट करावे।
  </p>
  <div style="margin-top:24px;"><strong>सलग्न:-</strong> BG की छाया प्रति</div>
  <div style="text-align:right;margin:32px 0 24px;">
    <div style="height:40px;"></div>
    <div style="font-weight:bold;">(${esc(d.signatoryName)})</div>
    <div>${esc(d.signatoryDesignation)}</div>
    <div>सा.नि.वि. जिला खण्ड द्वितीय उदयपुर</div>
  </div>
  <div style="margin-top:16px;font-size:12px;">
    <div style="margin-bottom:4px;"><strong>क्रमांक:-</strong> ${esc(d.letterNo) || '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'}</div>
    <div style="margin-bottom:8px;">
      प्रतिलिपि ${esc(d.ccBankName)}, ${esc(d.ccBankAddress)} को प्रस्तुत कर
      निवेदन है कि उक्त बैंक गारन्टी को सत्यापित कर इस कार्यालय को अवगत करावें।
    </div>
    <div style="text-align:right;margin-top:20px;">
      <div style="font-weight:bold;">(${esc(d.signatoryName)})</div>
      <div>${esc(d.signatoryDesignation)}</div>
      <div>सा.नि.वि. जिला खण्ड द्वितीय उदयपुर</div>
    </div>
  </div>`;
}

function buildExtensionHtml(d: BankCommunicationData): string {
  return `
  <div style="text-align:center;margin-bottom:16px;">
    <div style="font-weight:bold;font-size:14px;">${esc(d.officeNameHi)}</div>
    <div style="font-weight:bold;font-size:13px;margin-top:2px;">${esc(d.departmentNameHi)}</div>
  </div>
  <div style="display:flex;justify-content:space-between;margin-bottom:16px;font-size:12px;">
    <div><strong>क्रमांक:-</strong> ${esc(d.letterNo) || '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'}</div>
    <div><strong>दिनांक:-</strong> ${esc(d.letterDate)}</div>
  </div>
  <div style="margin-bottom:16px;">
    <div>मैसर्स <strong>${esc(d.contractorName)}</strong>,</div>
    <div>${esc(d.contractorClass)}</div>
    <div>${esc(d.contractorAddress)}</div>
  </div>
  <div style="margin-bottom:16px;"><strong>विषय:-</strong> बैंक गारंटी की वैधता अवधि बढ़ाने के संबंध में।</div>
  <p style="text-align:justify;margin-bottom:12px;line-height:1.8;">
    महोदय,
  </p>
  <p style="text-align:justify;margin-bottom:20px;line-height:1.8;">
    उपरोक्त विषयान्तर्गत लेख है कि सन्दर्भित पत्र द्वारा
    <strong>${esc(d.projectName)}</strong> कार्य की बेक गारंटी संख्या
    <strong>${esc(d.bgNumber)}</strong> दिनांक <strong>${esc(d.bgDate)}</strong>
    राशि <strong>${esc(d.bgAmount)}/-</strong> (${esc(d.bgAmountWords)}) प्रस्तुत की गयी थी
    जिसकी वैधता अवधि <strong>${esc(d.bgExpiryDate)}</strong> को समाप्त हो रही है।
    अतः इस पत्र द्वारा लिखा जाता है कि <strong>${esc(d.extensionDays)}</strong> दिवस में
    उक्त बैंक गारन्टी की वैधता अवधि बढाकर प्रस्तुत करे।
  </p>
  <div style="text-align:right;margin:32px 0 24px;">
    <div style="height:40px;"></div>
    <div style="font-weight:bold;">(${esc(d.signatoryName)})</div>
    <div>${esc(d.signatoryDesignation)}</div>
    <div>सा.नि.वि. जिला खण्ड द्वितीय उदयपुर</div>
  </div>
  <div style="margin-top:24px;font-size:12px;">
    <div style="margin-bottom:4px;"><strong>क्रमांक:-</strong> ${esc(d.letterNo) || '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'}</div>
    <div style="margin-bottom:8px;">
      प्रतिलिपि प्रबन्धक, ${esc(d.ccBankName)}, ${esc(d.ccBankAddress)} को
      प्रस्तुत कर निवेदन है कि उक्त बैंक गारन्टी की समयावधि बढाकर प्रस्तुत करें।
    </div>
    <div style="text-align:right;margin-top:24px;">
      <div style="font-weight:bold;">(${esc(d.signatoryName)})</div>
      <div>${esc(d.signatoryDesignation)}</div>
      <div>सा.नि.वि. जिला खण्ड द्वितीय उदयपुर</div>
    </div>
  </div>`;
}

function buildBankExtensionHtml(d: BankCommunicationData): string {
  return `
  <div style="text-align:center;margin-bottom:16px;">
    <div style="font-weight:bold;font-size:14px;">${esc(d.officeNameHi)}</div>
    <div style="font-weight:bold;font-size:13px;margin-top:2px;">${esc(d.departmentNameHi)}</div>
  </div>
  <div style="display:flex;justify-content:space-between;margin-bottom:16px;font-size:12px;">
    <div><strong>क्रमांक:-</strong> ${esc(d.letterNo) || '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'}</div>
    <div><strong>दिनांक:-</strong> ${esc(d.letterDate)}</div>
  </div>
  <div style="margin-bottom:16px;">
    <div><strong>प्रबन्धक,</strong></div>
    <div>${esc(d.bankName)},</div>
    <div>शाखा — ${esc(d.bankBranch)}</div>
  </div>
  <div style="margin-bottom:8px;"><strong>विषय:-</strong> बैंक गारन्टी की वैधता अवधि विस्तार कराने बाबत्।</div>
  <div style="margin-bottom:16px;"><strong>सन्दर्भ:-</strong> बैंक गारन्टी संख्या ${esc(d.bgNumber)} दिनांक ${esc(d.bgDate)}</div>
  <p style="text-align:justify;margin-bottom:12px;line-height:1.8;">
    महोदय,
  </p>
  <p style="text-align:justify;margin-bottom:12px;line-height:1.8;">
    उपरोक्त विषयान्तर्गत लेख है कि सन्दर्भित पत्र द्वारा
    <strong>${esc(d.projectName)}</strong> कार्य की बेक गारंटी संख्या
    <strong>${esc(d.bgNumber)}</strong> दिनांक <strong>${esc(d.bgDate)}</strong>,
    राशि रु. <strong>${esc(d.bgAmount)}/-</strong> (${esc(d.bgAmountWords)} मात्र)
    मैसर्स <strong>${esc(d.contractorName)}</strong>, ${esc(d.contractorAddress)} द्वारा
    प्रस्तुत की गयी थी जिसकी वैधता अवधि <strong>${esc(d.bgExpiryDate)}</strong> को समाप्त हो रही है।
  </p>
  <p style="text-align:justify;margin-bottom:20px;line-height:1.8;">
    अतः इस पत्र द्वारा लिखा जाता है कि उक्त बैंक गारन्टी की वैधता अवधि दिनांक
    <strong>${esc(d.bgNewExpiryDate)}</strong> तक विस्तारित कर सम्बन्धित दस्तावेज
    तत्काल इस कार्यालय में प्रेषित किये जावें।
  </p>
  <div style="text-align:right;margin:32px 0 24px;">
    <div style="height:40px;"></div>
    <div style="font-weight:bold;">(${esc(d.signatoryName)})</div>
    <div>${esc(d.signatoryDesignation)}</div>
    <div>सा.नि.वि. जिला खण्ड द्वितीय उदयपुर</div>
  </div>
  <div style="margin-top:16px;font-size:12px;">
    <div style="margin-bottom:4px;"><strong>क्रमांक:-</strong> ${esc(d.letterNo) || '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'}</div>
    <div style="margin-bottom:8px;">
      प्रतिलिपि मैसर्स ${esc(d.ccContractorName)}, ${esc(d.ccContractorAddress)} को
      प्रस्तुत कर निवेदन है कि उक्त बैंक गारन्टी की समयावधि दिनांक
      <strong>${esc(d.bgNewExpiryDate)}</strong> तक बढाकर इस कार्यालय में प्रस्तुत करें।
    </div>
    <div style="text-align:right;margin-top:20px;">
      <div style="font-weight:bold;">(${esc(d.signatoryName)})</div>
      <div>${esc(d.signatoryDesignation)}</div>
      <div>सा.नि.वि. जिला खण्ड द्वितीय उदयपुर</div>
    </div>
  </div>`;
}

function buildStandaloneHtml(template: TemplateType, d: BankCommunicationData): string {
  const body =
    template === 'bg-verification'
      ? buildVerificationHtml(d)
      : template === 'bg-extension'
      ? buildExtensionHtml(d)
      : buildBankExtensionHtml(d);
  const title =
    template === 'bg-verification'
      ? 'Bank Guarantee Verification Letter'
      : template === 'bg-extension'
      ? 'Bank Guarantee Extension Letter (to Contractor)'
      : 'Bank Guarantee Validity Extension Request (to Bank)';

  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8"/>
<title>${title}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>
  @page { size: A4; margin: 18mm 20mm; }
  body {
    font-family: 'Mangal', 'Noto Sans Devanagari', 'Nirmala UI', Arial, sans-serif;
    font-size: 12px; line-height: 1.6; color: #000; margin: 0;
  }
  .wrap { max-width: 170mm; margin: 0 auto; }
</style>
</head>
<body><div class="wrap">${body}</div></body>
</html>`;
}

// ─── Field Component ──────────────────────────────────────────────────────────

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-sm font-semibold">
        {label}
        {hint && <span className="ml-1 font-normal text-muted-foreground text-xs">({hint})</span>}
      </Label>
      {children}
    </div>
  );
}

// ─── Preview Components ───────────────────────────────────────────────────────

function VerificationPreview({ d }: { d: BankCommunicationData }) {
  return (
    <>
      <div className="text-center mb-5">
        <h1 className="text-[14px] font-bold">{d.officeNameHi}</h1>
        <h2 className="text-[13px] font-bold mt-0.5">{d.departmentNameHi}</h2>
      </div>

      <div className="flex justify-between mb-5 text-[12px]">
        <div>
          <span className="font-bold">क्रमांक:-</span>{' '}
          {d.letterNo || '………………………………'}
        </div>
        <div>
          <span className="font-bold">दिनांक:-</span> {d.letterDate}
        </div>
      </div>

      <div className="mb-5">
        <div className="font-bold">श्रीमान प्रबन्धक महोदय,</div>
        <div>{d.bankName} {d.bankBranch}</div>
      </div>

      <div className="mb-2">
        <span className="font-bold">विषय:-</span> बैंक गारन्टी सत्यापित कराने बाबत।
      </div>
      <div className="mb-5">
        <span className="font-bold">सन्दर्भ:-</span> बैंक गारन्टी संख्या {d.bgNumber} दिनांक {d.bgDate}
      </div>

      <p className="text-justify mb-3 leading-relaxed">महोदय,</p>

      <p className="text-justify mb-5 leading-relaxed">
        उपरोक्त विषयान्तर्गत निवेदन है कि आपके द्वारा जारी बैंक गारन्टी संख्या{' '}
        <strong>{d.bgNumber}</strong> दिनांक <strong>{d.bgDate}</strong> RS.{' '}
        <strong>{d.bgAmount}</strong> ({d.bgAmountWords} मात्र) मैसर्स{' '}
        <strong>{d.contractorName}</strong> {d.contractorAddress} के नाम जारी की गई है। उक्त
        बैंक गारन्टी की छाया प्रति संलग्न कर भिजवाई जा रही है।
        कृपया सत्यापित कराने का कष्ट करावे।
      </p>

      <div className="mt-6">
        <span className="font-bold">सलग्न:-</span> BG की छाया प्रति
      </div>

      <div className="flex justify-end mb-6 mt-8">
        <div className="text-center w-[220px]">
          <div className="h-10" />
          <div className="font-bold">({d.signatoryName})</div>
          <div>{d.signatoryDesignation}</div>
          <div>सा.नि.वि. जिला खण्ड द्वितीय उदयपुर</div>
        </div>
      </div>

      <div className="mt-6 text-[12px]">
        <div className="mb-1">
          <span className="font-bold">क्रमांक:-</span>{' '}
          {d.letterNo || '………………………………'}
        </div>
        <p className="text-justify leading-relaxed">
          प्रतिलिपि {d.ccBankName}, {d.ccBankAddress} को प्रस्तुत कर
          निवेदन है कि उक्त बैंक गारन्टी को सत्यापित कर इस कार्यालय को अवगत
          करावें।
        </p>
        <div className="flex justify-end mt-6">
          <div className="text-center w-[220px]">
            <div className="font-bold">({d.signatoryName})</div>
            <div>{d.signatoryDesignation}</div>
            <div>सा.नि.वि. जिला खण्ड द्वितीय उदयपुर</div>
          </div>
        </div>
      </div>
    </>
  );
}

function ExtensionPreview({ d }: { d: BankCommunicationData }) {
  return (
    <>
      <div className="text-center mb-5">
        <h1 className="text-[14px] font-bold">{d.officeNameHi}</h1>
        <h2 className="text-[13px] font-bold mt-0.5">{d.departmentNameHi}</h2>
      </div>

      <div className="flex justify-between mb-5 text-[12px]">
        <div>
          <span className="font-bold">क्रमांक:-</span>{' '}
          {d.letterNo || '………………………………'}
        </div>
        <div>
          <span className="font-bold">दिनांक:-</span> {d.letterDate}
        </div>
      </div>

      <div className="mb-5">
        <div>मैसर्स <strong>{d.contractorName}</strong>,</div>
        <div>{d.contractorClass}</div>
        <div>{d.contractorAddress}</div>
      </div>

      <div className="mb-5">
        <span className="font-bold">विषय:-</span> बैंक गारंटी की वैधता अवधि बढ़ाने के संबंध में।
      </div>

      <p className="text-justify mb-3 leading-relaxed">महोदय,</p>

      <p className="text-justify mb-5 leading-relaxed">
        उपरोक्त विषयान्तर्गत लेख है कि सन्दर्भित पत्र द्वारा{' '}
        <strong>{d.projectName}</strong> कार्य की बेक गारंटी संख्या{' '}
        <strong>{d.bgNumber}</strong> दिनांक <strong>{d.bgDate}</strong> राशि{' '}
        <strong>{d.bgAmount}/-</strong> ({d.bgAmountWords}) प्रस्तुत की गयी थी जिसकी वैधता
        अवधि <strong>{d.bgExpiryDate}</strong> को समाप्त हो रही है। अतः इस पत्र द्वारा लिखा
        जाता है कि <strong>{d.extensionDays}</strong> दिवस में उक्त बैंक गारन्टी की वैधता
        अवधि बढाकर प्रस्तुत करे।
      </p>

      <div className="flex justify-end mb-6">
        <div className="text-center w-[220px]">
          <div className="h-10" />
          <div className="font-bold">({d.signatoryName})</div>
          <div>{d.signatoryDesignation}</div>
          <div>सा.नि.वि. जिला खण्ड द्वितीय उदयपुर</div>
        </div>
      </div>

      <div className="mt-6 text-[12px]">
        <div className="mb-1">
          <span className="font-bold">क्रमांक:-</span>{' '}
          {d.letterNo || '………………………………'}
        </div>
        <p className="text-justify leading-relaxed">
          प्रतिलिपि प्रबन्धक, {d.ccBankName}, {d.ccBankAddress} को प्रस्तुत कर निवेदन है कि
          उक्त बैंक गारन्टी की समयावधि बढाकर प्रस्तुत करें।
        </p>
        <div className="flex justify-end mt-6">
          <div className="text-center w-[220px]">
            <div className="font-bold">({d.signatoryName})</div>
            <div>{d.signatoryDesignation}</div>
            <div>सा.नि.वि. जिला खण्ड द्वितीय उदयपुर</div>
          </div>
        </div>
      </div>
    </>
  );
}

function BankExtensionPreview({ d }: { d: BankCommunicationData }) {
  return (
    <>
      <div className="text-center mb-5">
        <h1 className="text-[14px] font-bold">{d.officeNameHi}</h1>
        <h2 className="text-[13px] font-bold mt-0.5">{d.departmentNameHi}</h2>
      </div>

      <div className="flex justify-between mb-5 text-[12px]">
        <div>
          <span className="font-bold">क्रमांक:-</span>{' '}
          {d.letterNo || '………………………………'}
        </div>
        <div>
          <span className="font-bold">दिनांक:-</span> {d.letterDate}
        </div>
      </div>

      <div className="mb-5">
        <div className="font-bold">प्रबन्धक,</div>
        <div>{d.bankName},</div>
        <div>शाखा — {d.bankBranch}</div>
      </div>

      <div className="mb-2">
        <span className="font-bold">विषय:-</span> बैंक गारन्टी की वैधता अवधि विस्तार कराने बाबत्।
      </div>
      <div className="mb-5">
        <span className="font-bold">सन्दर्भ:-</span> बैंक गारन्टी संख्या {d.bgNumber} दिनांक {d.bgDate}
      </div>

      <p className="text-justify mb-3 leading-relaxed">महोदय,</p>

      <p className="text-justify mb-3 leading-relaxed">
        उपरोक्त विषयान्तर्गत लेख है कि सन्दर्भित पत्र द्वारा{' '}
        <strong>{d.projectName}</strong> कार्य की बेक गारंटी संख्या{' '}
        <strong>{d.bgNumber}</strong> दिनांक <strong>{d.bgDate}</strong>, राशि रु.{' '}
        <strong>{d.bgAmount}/-</strong> ({d.bgAmountWords} मात्र) मैसर्स{' '}
        <strong>{d.contractorName}</strong>, {d.contractorAddress} द्वारा प्रस्तुत की गयी थी
        जिसकी वैधता अवधि <strong>{d.bgExpiryDate}</strong> को समाप्त हो रही है।
      </p>

      <p className="text-justify mb-5 leading-relaxed">
        अतः इस पत्र द्वारा लिखा जाता है कि उक्त बैंक गारन्टी की वैधता अवधि दिनांक{' '}
        <strong>{d.bgNewExpiryDate}</strong> तक विस्तारित कर सम्बन्धित दस्तावेज तत्काल इस
        कार्यालय में प्रेषित किये जावें।
      </p>

      <div className="flex justify-end mb-6">
        <div className="text-center w-[220px]">
          <div className="h-10" />
          <div className="font-bold">({d.signatoryName})</div>
          <div>{d.signatoryDesignation}</div>
          <div>सा.नि.वि. जिला खण्ड द्वितीय उदयपुर</div>
        </div>
      </div>

      <div className="mt-6 text-[12px]">
        <div className="mb-1">
          <span className="font-bold">क्रमांक:-</span>{' '}
          {d.letterNo || '………………………………'}
        </div>
        <p className="text-justify leading-relaxed">
          प्रतिलिपि मैसर्स {d.ccContractorName}, {d.ccContractorAddress} को प्रस्तुत कर
          निवेदन है कि उक्त बैंक गारन्टी की समयावधि दिनांक{' '}
          <strong>{d.bgNewExpiryDate}</strong> तक बढाकर इस कार्यालय में प्रस्तुत करें।
        </p>
        <div className="flex justify-end mt-6">
          <div className="text-center w-[220px]">
            <div className="font-bold">({d.signatoryName})</div>
            <div>{d.signatoryDesignation}</div>
            <div>सा.नि.वि. जिला खण्ड द्वितीय उदयपुर</div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BankCommunicationGenerator() {
  const [template, setTemplate] = useState<TemplateType>('bg-verification');
  const [data, setData] = useState<BankCommunicationData>(defaultData);
  const pageRef = useRef<HTMLDivElement>(null);

  function update<K extends keyof BankCommunicationData>(key: K, value: BankCommunicationData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  const handlePrint = () => window.print();
  const handleReset = () => {
    setData(defaultData);
    setTemplate('bg-verification');
  };

  const handleDownloadDoc = () => {
    const html = buildStandaloneHtml(template, data);
    const name =
      template === 'bg-verification'
        ? 'bg-verification-letter'
        : template === 'bg-extension'
        ? 'bg-extension-letter-contractor'
        : 'bg-extension-request-to-bank';
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const selectedTemplate = TEMPLATE_OPTIONS.find((t) => t.value === template)!;

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* ── LEFT PANEL: FORM ── */}
      <div className="w-[420px] flex flex-col border-r bg-card shadow-md hide-on-print z-10 flex-shrink-0">
        <div className="px-4 py-3 border-b bg-primary text-primary-foreground">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-bold text-base leading-tight">बैंक संचार पत्र</h1>
              <p className="text-xs text-primary-foreground/75 mt-0.5">
                Bank Communication — P.W.D. District Div.-II Udaipur
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleReset}
              title="Reset"
              className="h-8 px-2 text-xs mt-0.5 shrink-0"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reset
            </Button>
          </div>
          <p className="mt-2 text-[11px] text-primary-foreground/80 bg-primary-foreground/10 rounded px-2 py-1 leading-relaxed">
            📋 टेम्पलेट चुनें और विवरण भरें — दाईं तरफ पत्र तैयार होगा।
            <br />
            <span className="text-primary-foreground/60">
              Select a template and fill details. The letter updates automatically.
            </span>
          </p>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6 pb-10">
            {/* Template selector */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 border-b pb-1.5">
                <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <p className="text-sm font-bold leading-none">टेम्पलेट चुनें</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Select Template</p>
                </div>
              </div>

              {TEMPLATE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    template === opt.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-muted/30 hover:bg-muted/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="template"
                    value={opt.value}
                    checked={template === opt.value}
                    onChange={() => setTemplate(opt.value)}
                    className="mt-1 accent-primary"
                  />
                  <div>
                    <div className="text-sm font-bold">{opt.labelHi}</div>
                    <div className="text-xs text-muted-foreground">{opt.labelEn}</div>
                    <div className="text-[11px] text-muted-foreground mt-1">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </section>

            {/* Letter details */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 border-b pb-1.5">
                <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <p className="text-sm font-bold leading-none">पत्र विवरण</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Letter Details</p>
                </div>
              </div>

              <Field label="क्रमांक" hint="Letter No.">
                <Input
                  value={data.letterNo}
                  onChange={(e) => update('letterNo', e.target.value)}
                  placeholder="जैसे: 325-26"
                  className="h-10"
                />
              </Field>

              <Field label="दिनांक" hint="Date">
                <Input
                  value={data.letterDate}
                  onChange={(e) => update('letterDate', e.target.value)}
                  placeholder="DD/MM/YYYY"
                  className="h-10"
                />
              </Field>
            </section>

            {/* Bank Guarantee details (shared) */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 border-b pb-1.5">
                <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <p className="text-sm font-bold leading-none">बैंक गारन्टी विवरण</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Bank Guarantee Details</p>
                </div>
              </div>

              <Field label="BG संख्या" hint="BG Number">
                <Input
                  value={data.bgNumber}
                  onChange={(e) => update('bgNumber', e.target.value)}
                  placeholder="जैसे: C73GT02251250002"
                  className="h-10 font-mono"
                />
              </Field>

              <Field label="BG दिनांक" hint="BG Date">
                <Input
                  value={data.bgDate}
                  onChange={(e) => update('bgDate', e.target.value)}
                  placeholder="DD.MM.YYYY"
                  className="h-10"
                />
              </Field>

              <Field label="BG राशि (अंकों में)" hint="Amount in Figures">
                <Input
                  value={data.bgAmount}
                  onChange={(e) => update('bgAmount', e.target.value)}
                  placeholder="जैसे: 8,43,734.00"
                  className="h-10"
                />
              </Field>

              <Field label="BG राशि (शब्दों में)" hint="Amount in Words">
                <Input
                  value={data.bgAmountWords}
                  onChange={(e) => update('bgAmountWords', e.target.value)}
                  placeholder="जैसे: आठ लाख तियालीस हजार..."
                  className="h-10"
                />
              </Field>
            </section>

            {/* Template-specific fields */}
            {template === 'bg-verification' ? (
              <section className="space-y-3">
                <div className="flex items-center gap-2 border-b pb-1.5">
                  <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                    4
                  </span>
                  <div>
                    <p className="text-sm font-bold leading-none">बैंक एवं ठेकेदार</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Bank & Contractor</p>
                  </div>
                </div>

                <Field label="बैंक का नाम" hint="Bank Name">
                  <Input
                    value={data.bankName}
                    onChange={(e) => update('bankName', e.target.value)}
                    placeholder="जैसे: HDFC Bank"
                    className="h-10"
                  />
                </Field>

                <Field label="बैंक शाखा / स्थान" hint="Branch / Location">
                  <Input
                    value={data.bankBranch}
                    onChange={(e) => update('bankBranch', e.target.value)}
                    placeholder="जैसे: उदयपुर"
                    className="h-10"
                  />
                </Field>

                <Field label="ठेकेदार / फर्म का नाम" hint="Contractor / Firm Name">
                  <Input
                    value={data.contractorName}
                    onChange={(e) => update('contractorName', e.target.value)}
                    placeholder="जैसे: रचना कन्स्ट्रक्शन"
                    className="h-10"
                  />
                </Field>

                <Field label="ठेकेदार का पता" hint="Contractor Address">
                  <Textarea
                    value={data.contractorAddress}
                    onChange={(e) => update('contractorAddress', e.target.value)}
                    placeholder="पूरा पता"
                    className="min-h-[72px] resize-none"
                  />
                </Field>

                <Field label="हस्ताक्षरकर्ता का नाम" hint="Signatory Name">
                  <Input
                    value={data.signatoryName}
                    onChange={(e) => update('signatoryName', e.target.value)}
                    placeholder="जैसे: अनिल खिच्ची"
                    className="h-10"
                  />
                </Field>

                <Field label="पदनाम" hint="Designation">
                  <Input
                    value={data.signatoryDesignation}
                    onChange={(e) => update('signatoryDesignation', e.target.value)}
                    placeholder="जैसे: अधिशाषी अभियन्ता"
                    className="h-10"
                  />
                </Field>

                <Field label="प्रतिलिपि — बैंक का नाम" hint="CC Bank Name">
                  <Input
                    value={data.ccBankName}
                    onChange={(e) => update('ccBankName', e.target.value)}
                    placeholder="जैसे: यूनियन बैंक ऑफ इण्डिया"
                    className="h-10"
                  />
                </Field>

                <Field label="प्रतिलिपि — बैंक का पता" hint="CC Bank Address">
                  <Textarea
                    value={data.ccBankAddress}
                    onChange={(e) => update('ccBankAddress', e.target.value)}
                    placeholder="बैंक शाखा का पूरा पता"
                    className="min-h-[72px] resize-none"
                  />
                </Field>
              </section>
            ) : template === 'bg-extension' ? (
              <section className="space-y-3">
                <div className="flex items-center gap-2 border-b pb-1.5">
                  <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                    4
                  </span>
                  <div>
                    <p className="text-sm font-bold leading-none">ठेकेदार एवं परियोजना</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Contractor & Project</p>
                  </div>
                </div>

                <Field label="ठेकेदार / फर्म का नाम" hint="Contractor / Firm Name">
                  <Input
                    value={data.contractorName}
                    onChange={(e) => update('contractorName', e.target.value)}
                    placeholder="जैसे: सिद्धार्थ शर्मा"
                    className="h-10"
                  />
                </Field>

                <Field label="ठेकेदार वर्ग" hint="Contractor Class">
                  <Input
                    value={data.contractorClass}
                    onChange={(e) => update('contractorClass', e.target.value)}
                    placeholder="जैसे: ए क्लास संवेदक"
                    className="h-10"
                  />
                </Field>

                <Field label="ठेकेदार का पता" hint="Contractor Address">
                  <Textarea
                    value={data.contractorAddress}
                    onChange={(e) => update('contractorAddress', e.target.value)}
                    placeholder="पूरा पता"
                    className="min-h-[72px] resize-none"
                  />
                </Field>

                <Field label="परियोजना / कार्य का नाम" hint="Project / Work Name">
                  <Textarea
                    value={data.projectName}
                    onChange={(e) => update('projectName', e.target.value)}
                    placeholder="Package No. और कार्य का विवरण"
                    className="min-h-[72px] resize-none"
                  />
                </Field>

                <Field label="BG वैधता समाप्ति दिनांक" hint="BG Expiry Date">
                  <Input
                    value={data.bgExpiryDate}
                    onChange={(e) => update('bgExpiryDate', e.target.value)}
                    placeholder="DD.MM.YYYY"
                    className="h-10"
                  />
                </Field>

                <Field label="विस्तार हेतु दिन" hint="Extension Days">
                  <Input
                    value={data.extensionDays}
                    onChange={(e) => update('extensionDays', e.target.value)}
                    placeholder="जैसे: 3"
                    className="h-10"
                  />
                </Field>

                <Field label="प्रतिलिपि — बैंक का नाम" hint="CC Bank Name">
                  <Input
                    value={data.ccBankName}
                    onChange={(e) => update('ccBankName', e.target.value)}
                    placeholder="जैसे: यूनियन बैंक ऑफ इण्डिया"
                    className="h-10"
                  />
                </Field>

                <Field label="प्रतिलिपि — बैंक का पता" hint="CC Bank Address">
                  <Textarea
                    value={data.ccBankAddress}
                    onChange={(e) => update('ccBankAddress', e.target.value)}
                    placeholder="बैंक शाखा का पूरा पता"
                    className="min-h-[72px] resize-none"
                  />
                </Field>

                <Field label="हस्ताक्षरकर्ता का नाम" hint="Signatory Name">
                  <Input
                    value={data.signatoryName}
                    onChange={(e) => update('signatoryName', e.target.value)}
                    placeholder="जैसे: अनिल खिच्ची"
                    className="h-10"
                  />
                </Field>

                <Field label="पदनाम" hint="Designation">
                  <Input
                    value={data.signatoryDesignation}
                    onChange={(e) => update('signatoryDesignation', e.target.value)}
                    placeholder="जैसे: अधिशाषी अभियन्ता"
                    className="h-10"
                  />
                </Field>
              </section>
            ) : (
              /* bg-bank-extension — Department → Bank directly */
              <section className="space-y-3">
                <div className="flex items-center gap-2 border-b pb-1.5">
                  <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                    4
                  </span>
                  <div>
                    <p className="text-sm font-bold leading-none">बैंक, ठेकेदार एवं परियोजना</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Bank, Contractor & Project</p>
                  </div>
                </div>

                <Field label="बैंक का नाम" hint="Bank Name">
                  <Input
                    value={data.bankName}
                    onChange={(e) => update('bankName', e.target.value)}
                    placeholder="जैसे: HDFC Bank"
                    className="h-10"
                  />
                </Field>

                <Field label="बैंक शाखा / स्थान" hint="Branch / Location">
                  <Input
                    value={data.bankBranch}
                    onChange={(e) => update('bankBranch', e.target.value)}
                    placeholder="जैसे: उदयपुर"
                    className="h-10"
                  />
                </Field>

                <Field label="ठेकेदार / फर्म का नाम" hint="Contractor / Firm Name">
                  <Input
                    value={data.contractorName}
                    onChange={(e) => update('contractorName', e.target.value)}
                    placeholder="जैसे: रचना कन्स्ट्रक्शन"
                    className="h-10"
                  />
                </Field>

                <Field label="ठेकेदार का पता" hint="Contractor Address">
                  <Textarea
                    value={data.contractorAddress}
                    onChange={(e) => update('contractorAddress', e.target.value)}
                    placeholder="पूरा पता"
                    className="min-h-[72px] resize-none"
                  />
                </Field>

                <Field label="परियोजना / कार्य का नाम" hint="Project / Work Name">
                  <Textarea
                    value={data.projectName}
                    onChange={(e) => update('projectName', e.target.value)}
                    placeholder="Package No. और कार्य का विवरण"
                    className="min-h-[72px] resize-none"
                  />
                </Field>

                <Field label="BG वैधता समाप्ति दिनांक" hint="Current Expiry Date">
                  <Input
                    value={data.bgExpiryDate}
                    onChange={(e) => update('bgExpiryDate', e.target.value)}
                    placeholder="DD.MM.YYYY"
                    className="h-10"
                  />
                </Field>

                <Field label="नई वैधता दिनांक" hint="New Extended Expiry Date">
                  <Input
                    value={data.bgNewExpiryDate}
                    onChange={(e) => update('bgNewExpiryDate', e.target.value)}
                    placeholder="DD.MM.YYYY"
                    className="h-10"
                  />
                </Field>

                <Field label="प्रतिलिपि — ठेकेदार का नाम" hint="CC Contractor Name">
                  <Input
                    value={data.ccContractorName}
                    onChange={(e) => update('ccContractorName', e.target.value)}
                    placeholder="जैसे: रचना कन्स्ट्रक्शन"
                    className="h-10"
                  />
                </Field>

                <Field label="प्रतिलिपि — ठेकेदार का पता" hint="CC Contractor Address">
                  <Textarea
                    value={data.ccContractorAddress}
                    onChange={(e) => update('ccContractorAddress', e.target.value)}
                    placeholder="ठेकेदार का पूरा पता"
                    className="min-h-[72px] resize-none"
                  />
                </Field>

                <Field label="हस्ताक्षरकर्ता का नाम" hint="Signatory Name">
                  <Input
                    value={data.signatoryName}
                    onChange={(e) => update('signatoryName', e.target.value)}
                    placeholder="जैसे: अनिल खिच्ची"
                    className="h-10"
                  />
                </Field>

                <Field label="पदनाम" hint="Designation">
                  <Input
                    value={data.signatoryDesignation}
                    onChange={(e) => update('signatoryDesignation', e.target.value)}
                    placeholder="जैसे: अधिशाषी अभियन्ता"
                    className="h-10"
                  />
                </Field>
              </section>
            )}

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <Button type="button" onClick={handlePrint} className="w-full h-12 text-base font-bold">
                <Printer className="mr-2 h-5 w-5" />
                🖨️ Print / Save as PDF
              </Button>
              <Button
                type="button"
                onClick={handleDownloadDoc}
                className="w-full h-12 text-base font-bold bg-emerald-700 hover:bg-emerald-800 text-white"
              >
                <FileDown className="mr-2 h-5 w-5" />
                💾 Save as .doc (Word)
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* ── RIGHT PANEL: A4 PREVIEW ── */}
      <div className="flex-1 overflow-auto bg-slate-100 p-8">
        <div className="max-w-[210mm] mx-auto mb-4 flex flex-wrap items-center justify-between gap-2 hide-on-print">
          <div>
            <p className="text-xs text-muted-foreground">
              Disable &quot;Headers and footers&quot; in the print dialog for best output.
            </p>
            <p className="text-xs font-semibold text-primary mt-1">{selectedTemplate.labelHi}</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handlePrint}>
              <Printer className="mr-1.5 h-3.5 w-3.5" /> Print / PDF
            </Button>
            <Button size="sm" variant="outline" onClick={handleDownloadDoc}>
              <FileDown className="mr-1.5 h-3.5 w-3.5" /> Word (.doc)
            </Button>
          </div>
        </div>

        <div
          ref={pageRef}
          className="a4-page doc-font text-[12px] leading-snug"
          style={{ fontFamily: "'Noto Sans Devanagari', 'Mangal', 'Nirmala UI', sans-serif" }}
        >
          {template === 'bg-verification' ? (
            <VerificationPreview d={data} />
          ) : template === 'bg-extension' ? (
            <ExtensionPreview d={data} />
          ) : (
            <BankExtensionPreview d={data} />
          )}
        </div>
      </div>
    </div>
  );
}
