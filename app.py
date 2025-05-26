import streamlit as st
import os
from pathlib import Path

# Set page config
st.set_page_config(
    page_title="Cafe24 Customized Proposal",
    page_icon="📊",
    layout="wide"
)

# Title
st.title("📊 Cafe24 Customized Proposal")

# HTML 파일 경로
html_path = os.path.join("files", "Cafe24_Customized_Proposal", "index.html")

# HTML 파일 내용 표시
if os.path.exists(html_path):
    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
        st.components.v1.html(html_content, height=800)
else:
    st.error("HTML 파일을 찾을 수 없습니다.")

# CSS 파일들 로드
css_files = [
    os.path.join("files", "Cafe24_Customized_Proposal", "css", "style.css"),
    os.path.join("files", "Cafe24_Customized_Proposal", "styles.css"),
    os.path.join("files", "Cafe24_Customized_Proposal", "proposal.css")
]

for css_file in css_files:
    if os.path.exists(css_file):
        with open(css_file, 'r', encoding='utf-8') as f:
            st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)

# JavaScript 파일들 로드
js_files = [
    os.path.join("files", "Cafe24_Customized_Proposal", "js", "market-analysis.js"),
    os.path.join("files", "Cafe24_Customized_Proposal", "js", "openai-service.js")
]

for js_file in js_files:
    if os.path.exists(js_file):
        with open(js_file, 'r', encoding='utf-8') as f:
            st.markdown(f'<script>{f.read()}</script>', unsafe_allow_html=True)

# 파일 목록 표시
st.subheader("프로젝트 파일 목록")
for root, dirs, files in os.walk("files"):
    for file in files:
        file_path = os.path.join(root, file)
        st.write(f"📄 {file_path}") 