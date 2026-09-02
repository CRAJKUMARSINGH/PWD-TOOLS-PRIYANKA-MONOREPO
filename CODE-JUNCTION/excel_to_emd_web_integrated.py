"""
Excel to EMD Web - Hand Receipt Generator (RPWA 28)
Integrated tool for PWD Tools Suite with HTML-based generation
"""

import streamlit as st
import streamlit.components.v1 as components
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent.parent))

try:
    from utils.branding import apply_custom_css
    from utils.navigation import create_breadcrumb, create_back_button
    has_utils = True
except ImportError:
    has_utils = False

def main():
    st.set_page_config(
        page_title="Excel to EMD (RPWA 28)",
        page_icon="📊",
        layout="wide"
    )

    if has_utils:
        apply_custom_css()
        create_breadcrumb("Excel to EMD")
    
    # Custom CSS for buttons
    st.markdown("""
    <style>
    .magenta-btn {
        background-color: #FF00FF !important;
        color: white !important;
        border: none !important;
        padding: 10px 20px !important;
        text-align: center !important;
        text-decoration: none !important;
        display: inline-block !important;
        font-size: 16px !important;
        margin: 4px 2px !important;
        cursor: pointer !important;
        border-radius: 8px !important;
        font-weight: bold !important;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
        transition: all 0.3s !important;
    }
    
    .magenta-btn:hover {
        background-color: #CC00CC !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 12px rgba(0,0,0,0.3) !important;
    }
    
    .info-box {
        background-color: #f8f0fa;
        border-left: 5px solid #FF00FF;
        padding: 15px;
        border-radius: 5px;
        margin: 20px 0;
    }
    
    @media print {
        .stApp > header, .stApp > .stToolbar, .stApp > .stDeployButton, 
        .stMarkdown, .stButton, .stHorizontalBlock, hr, .info-box {
            display: none !important;
        }
        
        iframe {
            width: 100% !important;
            height: 100% !important;
            border: none !important;
        }
        
        body, html {
            margin: 0 !important;
            padding: 0 !important;
        }
        
        iframe {
            display: block !important;
        }
    }
    </style>
    """, unsafe_allow_html=True)
    
    st.markdown("## 📊 Excel to EMD - Hand Receipt Generator")
    st.markdown("### Generate professional hand receipts from Excel files")
    
    # Read and display the HTML content
    try:
        html_path = Path(__file__).parent.parent / "static" / "html" / "ExcelToEmd.html"
        with open(html_path, "r", encoding="utf-8") as f:
            html_content = f.read()

        col_left, col_center, col_right = st.columns([1, 10, 1])
        with col_center:
            components.html(html_content, height=800, scrolling=True, width=1200)

    except FileNotFoundError:
        st.error("Tool not available - HTML file not found")

    # Instructions
    st.markdown("---")
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        st.markdown('<div class="info-box"><h3>💡 How to Use This Tool</h3>', unsafe_allow_html=True)
        st.markdown("""
        <ol>
            <li>Download the sample Excel file to see the required format</li>
            <li>Prepare your Excel file with columns: Payee Name, Amount, Work</li>
            <li>Upload your Excel file using the file input</li>
            <li>Click <strong>Generate Receipts</strong> to create hand receipts</li>
            <li>Use <strong>Print All Receipts</strong> to print or save as PDF</li>
            <li>Maximum 50 rows will be processed per file</li>
        </ol>
        </div>
        """, unsafe_allow_html=True)
        
        if st.button("📄 Open Excel to EMD Generator", key="open_html", help="Open the Excel to EMD generator in a new tab"):
            st.markdown("""
            <script>
            window.open('./static/html/ExcelToEmd.html', '_blank');
            </script>
            """, unsafe_allow_html=True)

    if has_utils:
        st.markdown("---")
        create_back_button()

if __name__ == "__main__":
    main()