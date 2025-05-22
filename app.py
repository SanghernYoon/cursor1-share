import streamlit as st
import os
from pathlib import Path
import tempfile

# Set page config
st.set_page_config(
    page_title="File Sharing Service",
    page_icon="📁",
    layout="wide"
)

# Title
st.title("📁 File Sharing Service")

# Create a temporary directory to store uploaded files
if 'uploaded_files' not in st.session_state:
    st.session_state.uploaded_files = {}

# File uploader
uploaded_file = st.file_uploader("Choose a file to share", type=None)

if uploaded_file is not None:
    # Save the uploaded file to the session state
    file_details = {
        "name": uploaded_file.name,
        "size": uploaded_file.size,
        "type": uploaded_file.type,
        "data": uploaded_file.getvalue()
    }
    st.session_state.uploaded_files[uploaded_file.name] = file_details
    st.success(f"File '{uploaded_file.name}' uploaded successfully!")

# Display uploaded files
if st.session_state.uploaded_files:
    st.subheader("Available Files")
    for filename, details in st.session_state.uploaded_files.items():
        col1, col2, col3 = st.columns([3, 1, 1])
        with col1:
            st.write(f"📄 {filename}")
        with col2:
            st.write(f"Size: {details['size'] / 1024:.1f} KB")
        with col3:
            st.download_button(
                label="Download",
                data=details['data'],
                file_name=filename,
                mime=details['type']
            )
else:
    st.info("No files have been uploaded yet. Use the file uploader above to share files.") 