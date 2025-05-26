import streamlit as st
import os
from pathlib import Path

# Set page config
st.set_page_config(
    page_title="파일 공유",
    page_icon="📁",
    layout="wide"
)

# Title
st.title("📁 파일 공유 서비스")

# 다운로드 폴더 경로
downloads_path = str(Path.home() / "Downloads")

# 파일 목록 가져오기
files = [f for f in os.listdir(downloads_path) if os.path.isfile(os.path.join(downloads_path, f))]

if files:
    st.subheader("사용 가능한 파일 목록")
    
    # 파일 목록을 표시
    for file in files:
        file_path = os.path.join(downloads_path, file)
        file_size = os.path.getsize(file_path) / 1024  # KB 단위로 변환
        
        col1, col2, col3 = st.columns([3, 1, 1])
        with col1:
            st.write(f"📄 {file}")
        with col2:
            st.write(f"{file_size:.1f} KB")
        with col3:
            with open(file_path, "rb") as f:
                st.download_button(
                    label="다운로드",
                    data=f,
                    file_name=file,
                    mime="application/octet-stream"
                )
else:
    st.info("다운로드 폴더에 파일이 없습니다.") 