import os
import sys
import requests
client_id = "5uo4zdnh1p"
client_secret = "DHGLMw6esaBEoYZXnMlglZVydrRTAtMNuitKMVy1"
url = "https://naveropenapi.apigw.ntruss.com/vision/v1/face" # 유명인 얼굴인식
files = {'image': open('face.jpg', 'rb')}
headers = {'X-NCP-APIGW-API-KEY-ID': client_id, 'X-NCP-APIGW-API-KEY': client_secret }
response = requests.post(url,  files=files, headers=headers)
rescode = response.status_code
if(rescode==200):
    print (response.text)
else:
    print("Error Code:" + str(rescode))
