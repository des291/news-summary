import numpy
import openai
# from trafilatura import fetch_url, extract, feeds, json_metadata, fetch_response
import trafilatura
from bs4 import BeautifulSoup
import requests
import json
import credentials
# import spacy
import sklearn
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/116.0'}

openai.api_key = credentials.openai_api_key
# nlp = spacy.load('en_core_web_lg')


class ReadRss:

    def __init__(self, rss_url, headers):

        self.url = rss_url
        self.headers = headers
        try:
            self.r = requests.get(rss_url, headers=self.headers)
            self.status_code = self.r.status_code
        except Exception as e:
            print('Error fetching the URL: ', rss_url)
            print(e)
        try:
            self.soup = BeautifulSoup(self.r.text, 'html.parser')
        except Exception as e:
            print('Could not parse the xml: ', self.url)
            print(e)

        self.articles = self.soup.find_all('item')
        # self.articles_dicts = [{'title': a.find('title').text, 'link': a.link.next_sibling.replace('\n', '').replace(
        #     '\t', '').replace('\r', ''), 'description': a.find('description').text, 'pubdate': a.find('pubdate').text} for a in self.articles]
        self.articles_dicts = [{'title': a.find('title').text, 'link': a.link.next_sibling.replace('\n', '').replace(
            '\t', '').replace('\r', ''), 'description': a.find('description').text} for a in self.articles]
        self.urls = [d['link'] for d in self.articles_dicts if 'link' in d]
        self.titles = [d['title'] for d in self.articles_dicts if 'title' in d]

        # self.descriptions = [d['description']
        #                      for d in self.articles_dicts if 'description' in d]
        # self.pub_dates = [d['pubdate']
        #                   for d in self.articles_dicts if 'pubdate' in d]


bbc = ReadRss('https://feeds.bbci.co.uk/news/rss.xml?edition=uk', headers)
guardian = ReadRss('https://www.theguardian.com/uk/rss', headers)

def to_json(articles, path):
    with open(path, 'w') as file:
        json.dump(articles, file)

# guardian_texts = []
# for text in guardian.articles_dicts:
#     guardian_texts.append(text['text'])

# def get_articles(articles_dicts, number):
#     articles = []
#     for article in articles_dicts[:number]:
#         article_data = {}
#         article_data['title'] = article['title']
#         article_data['link'] = article['link']
#         downloaded = trafilatura.fetch_response(article_data['link'].strip())
#         result = trafilatura.extract(downloaded, include_comments=False,
#                      include_tables=False, include_links=False)
#         article_data['text'] = result
#         articles.append(article_data)
#     return articles

def get_articles(articles_dicts):
    articles = []
    for article in articles_dicts:
        article_data = {}
        article_data['title'] = article['title']
        article_data['link'] = article['link']
        downloaded = trafilatura.fetch_response(article_data['link'].strip())
        result = trafilatura.extract(downloaded, include_comments=False,
                     include_tables=False, include_links=False)
        article_data['text'] = result
        articles.append(article_data)
    return articles

def summarise_article(article_text):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful summarisation tool that provides seven sentence summaries of text."},
            {"role": "user", "content": "Please provide a seven sentence summary of the following: " + article_text}
        ]
    )
    return response['choices'][0]['message']['content']

# def get_similar_link(article, dicts):
#     similarities = []
#     processed_article = nlp(article)
#     for text in dicts:
#         processed_comp = nlp(text['text'])
#         similarities.append(processed_article.similarity(processed_comp))
#     max_index = similarities.index(max(similarities))
#     return dicts[max_index]['link']

def get_similar_link(article, dicts):
    # similarities = []
    vectorizer = TfidfVectorizer()
    # for text in dicts:
    #     vectors = vectorizer.fit_transform([article, text['text']])
    #     print(vectors.shape)
        # similarities.append(cosine_similarity(vectors))
    articles = [comp_article['text'] for comp_article in dicts]
    articles.insert(0, article)
    vectors = vectorizer.fit_transform(articles)
    similarity = cosine_similarity(vectors[0:1], vectors)
    similarity = numpy.delete(similarity[0],0)
    max_index = similarity.argmax()
    return dicts[max_index]['link']

bbc_articles = get_articles(bbc.articles_dicts[:7])
guardian_articles = get_articles(guardian.articles_dicts)

for article in bbc_articles:
    article['summary'] = summarise_article(article['text'])
    article['guardian_link'] = get_similar_link(article['text'], guardian_articles)

# for article in bbc.articles_dicts[:7]:
#     article_data = {}
#     article_data['title'] = article['title']
#     article_data['link'] = article['link']
#     downloaded = trafilatura.fetch_response(article_data['link'].strip())
#     result = trafilatura.extract(downloaded, include_comments=False,
#                      include_tables=False, include_links=False,)
#     article_data['text'] = result
#     response = openai.ChatCompletion.create(
#         model="gpt-3.5-turbo",
#         messages=[
#             {"role": "system", "content": "You are a helpful summarisation tool that provides seven sentence summaries of text."},
#             {"role": "user", "content": "Please provide a seven sentence summary of the following: " + article_data['text']}
#         ]
#     )
#     article_data['summary'] = response['choices'][0]['message']['content']
#     processed_bbc = nlp(article_data['text'])
#     similarities = []
#     for text in guardian_texts:
#         processed_guardian = nlp(text)
#         similarities.append(processed_bbc.similarity(processed_guardian))
#     max_index = similarities.index(max(similarities))
#     article_data['guardian_link'] = guardian.articles_dicts[max_index]['link']

#     articles.append(article_data)


# below no longer needed
# guardian_articles = []
# for article in guardian.articles_dicts[:7]:
#     article_data = {}
#     print(article['title'])
#     article_data['title'] = article['title']
#     print(article['link'])
#     article_data['link'] = article['link']
#     downloaded = fetch_url(article['link'])
#     result = extract(downloaded, include_comments=False,
#                      include_tables=False, include_links=False,)
#     article_data['text'] = result
#     guardian_articles.append(article_data)

to_json(bbc_articles, 'data/bbc.json')
# # to_json(guardian_articles, 'data/guardian.json') 
# # print(guardian.articles_dicts[:7])

# bbc_desc = bbc.articles_dicts[0]['description']



# processed_bbc = nlp(bbc_desc)
# similarities = []
# for desc in guardian_descs:
#     processed_guardian = nlp(desc)
#     similarities.append(processed_bbc.similarity(processed_guardian))

# max_index = similarities.index(max(similarities))
# print(max_index)
# print(bbc.articles_dicts[0])
# print(guardian.articles_dicts[0])
# print(guardian_descs[max_index])
