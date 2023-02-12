#!/usr/bin/env python
# coding: utf-8

# # Breast Cancer Type Prediction
# ## Diagnosis Column (Class Labels) : 2
# ## Malignant(1) & Benign (0)

# # Ignore warnings

# In[1]:


import warnings
warnings.filterwarnings ('ignore')


# # Import libraries

# In[2]:


import numpy as np
import pandas as pd
import mysql.connector
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import BernoulliNB, GaussianNB, MultinomialNB
from sklearn.svm import SVC
from sklearn.metrics import confusion_matrix, accuracy_score, classification_report
# In[3]:
db = mysql.connector.connect (
    host = 'localhost',
    user = 'root',
    password = 'Umer1234',
    database = 'breastcancer'
)

cursor = db.cursor ()

breast_cancer_data = pd.read_csv ('data.csv')


# In[10]:
breast_corr = breast_cancer_data.corr ()


# In[11]:
corr_value = breast_corr.iloc [0, :].values


# In[12]:
new_corr_value_list = []
col_index = []

for i in range (len (breast_cancer_data.columns)):
    if (corr_value[i] > 0.7):
        new_corr_value_list.append (corr_value[i])
        if i == 0:
            continue
        col_index.append (i)
        
new_corr_value_list.remove (1.0)
# In[13]:
features_data = breast_cancer_data.iloc [:, col_index]
X = breast_cancer_data.iloc [:, col_index].values

# In[14]:
target = breast_cancer_data.iloc [:, 0]
y = breast_cancer_data.iloc [:, 0].values

# In[17]:
x_train, x_test, y_train, y_test = train_test_split (X, y, test_size=0.3, random_state=42)


# In[28]:
LR = LogisticRegression ()
LR.fit (x_train, y_train)


# In[34]:


def predict_cancer (lst):
    if LR.predict (lst)[0] == 0:
        return ('Benign Cancer detected !!!', 0)
    else:
        return ('Malignant Cancer detected !!!', 1)


# In[42]:
# pat_detail = []
# fields = ['Radius mean: ', 'Perimeter mean: ', 'Area mean: ', 'Concave point mean: ', 'Worst radius mean: ', 'Perimeter worst mean: ', 'Area worst mean: ','Concave point worst mean: ']

# for i in range (8):
    # pat_detail.append (int (input (fields [i])))

cursor.execute ('SELECT * FROM cancer_detail')

result = cursor.fetchall ()[-1]
user_cancer_detail = []
patient_detail = np.array ([], dtype='int64')

for i in range (len (result)):
    user_cancer_detail.append (result[i])

patient_detail = np.append (patient_detail, user_cancer_detail)
result = predict_cancer (patient_detail.reshape (1, -1))    
# print ("Result: {}".format (result))

sql = "INSERT INTO cancer_result(cr_result, cr_result_num) VALUES (%s, %s)"
val = result

cursor .execute (sql, val)
db.commit ()
