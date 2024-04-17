import subprocess
import time
def run():
    file_path = r'C:\Users\User\barcode scan from site\barcode\public\index.js'
    node_process = subprocess.Popen(['node ', file_path])
    time.sleep(6)
    node_process.terminate()
run()   

