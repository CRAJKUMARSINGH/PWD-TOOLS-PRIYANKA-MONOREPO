# Excel to EMD - Hand Receipt Generator (RPWA 28)

Standalone deployment tool for generating professional hand receipts for EMD refunds.

## Features

- Upload Excel files (.xlsx) with payee information
- Automatically generate RPWA 28 compliant hand receipts
- PDF generation with proper formatting
- Column name matching for flexible Excel structures
- Error handling and validation

## Required Excel Columns

- **Payee Name:** Contractor/payee name (or Name, Contractor, Payee)
- **Amount:** Payment amount in numbers (or Value, Cost, Payment, Total)
- **Work:** Work description (or Description, Item, Project, Job)

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the application:
```bash
streamlit run excel_to_emd_web.py
```

Or use the batch file:
```bash
run_app.bat
```

## Deployment

This can be deployed to Streamlit Cloud or similar platforms. Ensure all dependencies are listed in requirements.txt.

## Dependencies

- streamlit
- pandas
- openpyxl
- Jinja2
- xhtml2pdf
