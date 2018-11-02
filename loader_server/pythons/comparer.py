#!/usr/bin/env python
#coding=utf-8

import os
import sys
import difflib
import filecmp
import shutil
import script.ignore
import hashlib
reload(sys)

cur_dir = sys.path[0]
basePath_ = ""
newtPath_ = ""
ucontent_ = "" #只比对出新版本中的更新内容

IGNORE = script.ignore.IGNORE

def EQU():
    CleanAllTemp()
    walk_dir()

def walk_dir(topdown=True):
    #newtPath_ 
    for proroot , dirs , files in os.walk(newtPath_ , topdown):
        for f in files:
            profile = os.path.join(proroot, f)
            relativepath = profile[len(newtPath_):]
            basefile = basePath_ + relativepath
            if f.find(".") == 0 or proroot.find("/.") > 0 or Ignore(profile):
                continue
            if os.path.exists(basefile) == False and os.path.exists(profile) :
                print "新版本增加 " + profile
                CopyFile(profile, ucontent_ + relativepath)
            else:
                if os.path.exists(basefile) and os.path.exists(profile) :
                    #对比方法
                    md5base = GetFileMD5(basefile)
                    md5pro  = GetFileMD5(profile)
                    if md5base != md5pro:
                        # print "-------- MD5 : " + md5base + "   MD5 pro :" +  md5pro
                        # CopyFile(basefile , BaseTempPath + relativepath)
                        CopyFile(profile  , ucontent_  + relativepath) 
                # else:
                #     if os.path.exists(basefile) :
                #         print "新版本删除 " + basefile
                        # CopyFile(basefile, BaseTempPath + relativepath) 


def GetFileMD5(filepath):
    myhash = hashlib.md5()
    f = file(filepath,'rb')
    while True:
        b =  f.read(8096)
        if not b:
            break
        myhash.update(b)
    f.close()
    return myhash.hexdigest() 
    
def CopyFile(path , newpath):
    # os.system('cp -rf "%s" "%s"' % (path, newpath))
    print "-------- COPY : " + path + "   " +  newpath
    pathdir    = path[:path.rfind("/")]
    newpathdir = newpath[:newpath.rfind("/")]
    if os.path.exists(pathdir) == False :
        os.makedirs(pathdir)
    if os.path.exists(newpathdir) == False:
        os.makedirs(newpathdir)
    shutil.copyfile(path,newpath)

def CleanAllTemp():
    if os.path.exists(ucontent_) :
        os.system('rm -rf "%s"' % (ucontent_))
    os.makedirs(ucontent_)

def Ignore(path):
    for ignore in IGNORE:
        if ignore.find(".") >= 0 : 
            if path.endswith(ignore):
                return True 
        else:
            if path.find("/" + ignore + "/") > 0 or path.endswith("/" + ignore):
                return True
    return False

if __name__ == '__main__':
    # print "-------------------------------------------------"
    basePath_ = sys.argv[1]
    newtPath_ = sys.argv[2]
    ucontent_ = sys.argv[3]

    EQU()
    # print "-----------------------success-------------------"
