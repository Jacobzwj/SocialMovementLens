import zipfile
import xml.etree.ElementTree as ET
import sys
import os

def read_docx(file_path):
    try:
        with zipfile.ZipFile(file_path) as z:
            xml_content = z.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            
            text_content = []
            
            # The namespace for word processing ml
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            # Find all paragraph elements
            for p in tree.findall('.//w:p', ns):
                paragraph_text = []
                # Find all run elements within the paragraph
                for r in p.findall('.//w:r', ns):
                    # Find text elements within the run
                    for t in r.findall('.//w:t', ns):
                        if t.text:
                            paragraph_text.append(t.text)
                
                if paragraph_text:
                    text_content.append(''.join(paragraph_text))
            
            return '\n'.join(text_content)
    except Exception as e:
        return f"Error reading docx: {str(e)}"

if __name__ == "__main__":
    file_path = "CodeBook_TwitterProtest_20250317.docx"
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
        
    if os.path.exists(file_path):
        print(read_docx(file_path))
    else:
        print(f"File not found: {file_path}")
