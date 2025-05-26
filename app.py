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

# 서버 파일 경로
server_path = os.path.join("files", "server.js")

# 서버 파일 내용 표시
if os.path.exists(server_path):
    with open(server_path, 'r') as f:
        server_code = f.read()
        st.code(server_code, language='javascript')
else:
    st.error("서버 파일을 찾을 수 없습니다.")

# 다른 파일들도 표시
st.subheader("프로젝트 파일 목록")
for root, dirs, files in os.walk("files"):
    for file in files:
        file_path = os.path.join(root, file)
        st.write(f"📄 {file_path}") 