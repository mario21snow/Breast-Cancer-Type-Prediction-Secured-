import sys
import pickle 
import numpy as np
import mysql.connector 

db = mysql.connector.connect (
    host = 'localhost',
    user = 'root',
    password = 'Umer1234',
    database = 'breastcancer'
)

cursor = db.cursor ()
model = pickle.load (open ('D://Projects//Mini Project SEM V Secured//Breast_Cancer_PY//model.sav', 'rb'))

cursor.execute ('Select * FROM cancer_detail')

result = cursor.fetchall ()[-1]
user_cancer_detail = []
patient_detail = np.array ([], dtype='int64')

for i in range (len (result)):
    user_cancer_detail.append (result[i])

patient_detail = np.append (patient_detail, user_cancer_detail)

def predict_cancer (lst):
    if model.predict (lst)[0] == 0:
        return ('Benign Cancer detected !!!', 0)
    return ('Malignant Cancer detected !!!', 1)

result = predict_cancer (patient_detail.reshape (1, -1))
sql = "INSERT INTO cancer_result(cr_result, cr_result_num) VALUES (%s, %s)"
val = result

cursor .execute (sql, val)
db.commit ()

sys.modules [__name__] = predict_cancer