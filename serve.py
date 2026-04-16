#!/usr/bin/env python3
import os, sys
os.chdir('/Users/luegopereira/Desktop/Projet_perso')
sys.argv = ['serve']
from http.server import HTTPServer, SimpleHTTPRequestHandler
HTTPServer(('', 3333), SimpleHTTPRequestHandler).serve_forever()
