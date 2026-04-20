import os
import shutil

src_java = r'D:\0Projects2\resume-writer\resume-points\java-backend'
src_react = r'D:\0Projects2\resume-writer\resume-points\react-frontend'
dest_dir = r'D:\0Projects2\resume-writer\resume-points\fullstack-java-react'

if not os.path.exists(dest_dir):
    os.makedirs(dest_dir)

def parse_md(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    parts = content.split('---')
    if len(parts) >= 3 and content.startswith('---'):
        frontmatter = parts[1]
        body = '---'.join(parts[2:]).strip()
        return frontmatter, body
    return "", content

def process_file(src_path, dest_path):
    if not os.path.exists(dest_path):
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        shutil.copy(src_path, dest_path)
        print(f"Copied {os.path.basename(src_path)}")
    else:
        # Merge
        print(f"Merging {os.path.basename(src_path)}")
        fm1, body1 = parse_md(dest_path)
        fm2, body2 = parse_md(src_path)
        
        # We assume dest_path has frontmatter we want to keep
        fm = fm1 if fm1 else fm2
        merged_body = body1.strip() + "\n" + body2.strip()
        
        with open(dest_path, 'w', encoding='utf-8') as f:
            if fm:
                f.write(f"---\n{fm.strip()}\n---\n\n{merged_body}\n")
            else:
                f.write(f"{merged_body}\n")

# Process React first
for root, _, files in os.walk(src_react):
    for file in files:
        if not file.endswith('.md'): continue
        rel = os.path.relpath(root, src_react)
        src_path = os.path.join(root, file)
        dest_path = os.path.join(dest_dir, rel, file)
        process_file(src_path, dest_path)

# Process Java, merging into React
for root, _, files in os.walk(src_java):
    for file in files:
        if not file.endswith('.md'): continue
        rel = os.path.relpath(root, src_java)
        src_path = os.path.join(root, file)
        dest_path = os.path.join(dest_dir, rel, file)
        process_file(src_path, dest_path)

print("Done")
