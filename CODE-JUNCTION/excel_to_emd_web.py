"""
Excel to EMD Web - Hand Receipt Generator (RPWA 28)
Fully integrated from PWD-Tools-MarudharHR-main
Standalone deployable tool
Run: streamlit run tools/excel_to_emd_web.py
"""

import streamlit as st
import pandas as pd
from jinja2 import Template
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent.parent))

try:
    from utils.branding import apply_custom_css
    from utils.navigation import create_breadcrumb, create_back_button
    has_utils = True
except ImportError:
    has_utils = False

try:
    from xhtml2pdf import pisa
    has_weasyprint = True
except ImportError:
    has_weasyprint = False

st.set_page_config(
    page_title="Hand Receipt Generator (RPWA 28)",
    page_icon="📄",
    layout="wide"
)

if has_utils:
    apply_custom_css()
    create_breadcrumb("Hand Receipt Generator")

# Receipt template
receipt_template = Template("""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=210mm, height=297mm">
    <title>Hand Receipt (RPWA 28)</title>
    <style>
        body { font-family: sans-serif; margin: 0; }
        @page { size: A4 portrait; margin: 10mm; }
        .container {
            width: 210mm; height: 297mm; margin: 0 auto;
            border: 2px solid #ccc; padding: 20px; box-sizing: border-box;
            position: relative; page-break-after: always;
        }
        .header { text-align: center; margin-bottom: 2px; }
        .details { margin-bottom: 1px; }
        .amount-words { font-style: italic; }
        .signature-area, .offices { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .signature-area td, .signature-area th { border: 1px solid #ccc; padding: 5px; text-align: left; }
        .offices td, .offices th { border: 1px solid black; padding: 5px; text-align: left; word-wrap: break-word; }
        .input-field { border-bottom: 1px dotted #ccc; padding: 3px; width: calc(100% - 10px); display: inline-block; }
        .bottom-left-box {
            position: absolute; bottom: 40mm; left: 40mm;
            border: 2px solid black; padding: 10px; width: 300px; text-align: left;
        }
        .bottom-left-box p { margin: 3px 0; }
        .bottom-left-box .blue-text { color: blue; }
    </style>
</head>
<body>
    {% for receipt in receipts %}
    <div class="container">
        <div class="header">
            <h2>Payable to: - {{ receipt.payee }} </h2>
            <h2>HAND RECEIPT (RPWA 28)</h2>
            <p>(Referred to in PWF&A Rules 418,424,436 & 438)</p>
            <p>Division - PWD District Division-II, Udaipur</p>
        </div>
        <div class="details">
            <p>(1)Cash Book Voucher No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
            <p>(2)Cheque No. and Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
            <p>(3) Pay for ECS Rs.{{ receipt.amount }}/- (Rupees <span class="amount-words">{{ receipt.amount_words }} only</span>)</p>
            <p>(4) Paid by me</p>
            <p>(5) Received from The Executive Engineer PWD District Division, Udaipur the sum of Rs. {{ receipt.amount }}/- (Rupees <span class="amount-words">{{ receipt.amount_words }} only</span>)</p>
            <p> Name of work for which payment is made: <span class="input-field">{{ receipt.work }}</span></p>
            <p> Chargeable to Head:- 8443 [EMD-Refund] </p>
            <table class="signature-area">
                <tr><td>Witness</td><td>Stamp</td><td>Signature of payee</td></tr>
                <tr><td>Cash Book No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Page No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td></td><td></td></tr>
            </table>
            <table class="offices">
                <tr><td>For use in the Divisional Office</td><td>For use in the Accountant General's office</td></tr>
                <tr><td>Checked</td><td>Audited/Reviewed</td></tr>
                <tr><td>Accounts Clerk</td><td>DA &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Auditor &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Supdt. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; G.O.</td></tr>
            </table>
        </div>
        <div class="bottom-left-box">
            <p class="blue-text"> Passed for Rs. {{ receipt.amount }}</p>
            <p class="blue-text"> In Words Rupees: {{ receipt.amount_words }} Only</p>
            <p class="blue-text"> Chargeable to Head:- 8443 [EMD-Refund]</p>
            <div class="seal"><p>Ar.</p><p>D.A.</p><p>E.E.</p></div>
        </div>
    </div>
    {% endfor %}
</body>
</html>
""")

def convert_number_to_words(num):
    """Convert number to words in Indian format"""
    ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"]
    tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]
    teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"]
    
    if num == 0:
        return "Zero"
    
    words = ""
    
    # Crores
    if num >= 10000000:
        crore_part = int(num / 10000000)
        words += convert_number_to_words(crore_part) + " Crore "
        num %= 10000000
    
    # Lakhs
    if num >= 100000:
        lakh_part = int(num / 100000)
        words += convert_number_to_words(lakh_part) + " Lakh "
        num %= 100000
    
    # Thousands
    if num >= 1000:
        thousand_part = int(num / 1000)
        words += convert_number_to_words(thousand_part) + " Thousand "
        num %= 1000
    
    # Hundreds
    if num >= 100:
        hundred_part = int(num / 100)
        words += ones[hundred_part] + " Hundred "
        num %= 100
    
    # Tens and ones
    if num > 0:
        if words != "":
            words += "and "
        
        if num < 10:
            words += ones[int(num)]
        elif num < 20:
            words += teens[int(num - 10)]
        else:
            words += tens[int(num / 10)]
            if num % 10 > 0:
                words += " " + ones[int(num % 10)]
    
    return words.strip()

def find_column(df_columns, possible_names):
    """Find column by matching possible names"""
    for name in possible_names:
        name_lower = name.lower()
        for col in df_columns:
            if name_lower in col.strip().lower():
                return col
    return None

def main():
    st.markdown("## 📄 Hand Receipt Generator (RPWA 28)")
    st.markdown("### Generate professional hand receipts for EMD refunds")
    
    # Info boxes
    st.info("""
    **How to Use:**
    1. Prepare your Excel file (.xlsx) with required columns
    2. Upload the file using the button below
    3. Click Generate PDF and download your receipts
    """)
    
    st.success("""
    **Required Excel Columns:**
    - **Payee Name:** Contractor/payee name (or Name, Contractor, Payee)
    - **Amount:** Payment amount in numbers (or Value, Cost, Payment, Total)
    - **Work:** Work description (or Description, Item, Project, Job)
    
    ⚠️ Maximum 50 rows will be processed per file
    """)
    
    # File uploader
    uploaded_file = st.file_uploader(
        "📁 Choose your Excel file",
        type=['xlsx'],
        help="Upload .xlsx file (max 10MB, 50 rows)"
    )
    
    if uploaded_file is not None:
        st.success(f"📁 File: {uploaded_file.name} | 📊 Size: {uploaded_file.size / 1024:.2f} KB")
        
        col1, col2 = st.columns([3, 1])
        
        with col1:
            if st.button("🚀 Generate PDF", type="primary", use_container_width=True):
                with st.spinner("✨ Processing your file and generating PDFs..."):
                    try:
                        # Read Excel file
                        uploaded_file.seek(0)
                        df = pd.read_excel(uploaded_file, nrows=50)
                        
                        # Find required columns
                        payee_col = find_column(df.columns, ['Payee Name', 'PayeeName', 'Name', 'Contractor', 'Payee'])
                        amount_col = find_column(df.columns, ['Amount', 'Value', 'Cost', 'Payment', 'Total'])
                        work_col = find_column(df.columns, ['Work', 'Description', 'Item', 'Project', 'Job'])
                        
                        if not all([payee_col, amount_col, work_col]):
                            missing = []
                            if not payee_col: missing.append("Payee Name")
                            if not amount_col: missing.append("Amount")
                            if not work_col: missing.append("Work")
                            st.error(f"❌ Missing required columns: {', '.join(missing)}")
                        else:
                            # Process data
                            receipts = []
                            for _, row in df.iterrows():
                                try:
                                    payee = str(row[payee_col]).strip()
                                    amount = float(row[amount_col])
                                    work = str(row[work_col]).strip()
                                    
                                    if payee and amount > 0 and work:
                                        receipts.append({
                                            "payee": payee,
                                            "amount": f"{amount:.2f}",
                                            "amount_words": convert_number_to_words(int(amount)),
                                            "work": work
                                        })
                                except (ValueError, TypeError):
                                    continue
                            
                            if not receipts:
                                st.error("❌ No valid data found in the Excel file")
                            else:
                                # Generate HTML
                                rendered_html = receipt_template.render(receipts=receipts)
                                
                                # Generate PDF if xhtml2pdf available
                                if has_weasyprint:
                                    from io import BytesIO
                                    result = BytesIO()
                                    pisa.CreatePDF(BytesIO(rendered_html.encode('utf-8')), dest=result)
                                    pdf_bytes = result.getvalue()
                                    
                                    st.success("✅ PDF generated successfully!")
                                    st.balloons()
                                    
                                    st.download_button(
                                        label="📥 Download PDF",
                                        data=pdf_bytes,
                                        file_name="hand_receipts.pdf",
                                        mime="application/pdf",
                                        use_container_width=True
                                    )
                                else:
                                    # Fallback to HTML download
                                    st.warning("⚠️ PDF generation not available. Downloading HTML instead.")
                                    st.download_button(
                                        label="📥 Download HTML",
                                        data=rendered_html,
                                        file_name="hand_receipts.html",
                                        mime="text/html",
                                        use_container_width=True
                                    )
                                
                                st.info(f"✅ Generated {len(receipts)} receipt(s)")
                    
                    except Exception as e:
                        st.error(f"❌ Error processing file: {str(e)}")
        
        with col2:
            if st.button("🗑️ Clear", use_container_width=True):
                st.rerun()
    
    if has_utils:
        st.markdown("---")
        create_back_button()

if __name__ == "__main__":
    main()
