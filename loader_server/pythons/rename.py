import os
import sys
cur_dir = sys.path[0]


if __name__ == '__main__':
	basePath_ = sys.argv[1]
	ext_ = sys.argv[2]
	next_ = sys.argv[3]
	for proroot , dirs , files in os.walk(basePath_ , True):
		for f in files:
			profile = os.path.join(proroot, f)
			if profile.endswith(ext_):
				nprofile = profile.replace(ext_, next_);
				os.system('mv -f "%s" "%s"' % (profile , nprofile))

	print("main_end")            	
