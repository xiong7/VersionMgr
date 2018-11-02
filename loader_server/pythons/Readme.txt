
# script/ignore.py   要忽略比较的文件夹(及其子文件) or 文件

# TempBase 原始文件(仅列出)
# TempPro  修改了的文件

# 如出现 类似代码被跳过的情况 检查是否是 报错被吞噬了
# 如空格引起的 目录不存在 报错会被吞噬而不print出来
# 路径包含 类似 facebook-android-sdk-4.12.0\ 2  也会出问题