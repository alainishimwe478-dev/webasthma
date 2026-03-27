import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBook, FaVideo, FaFileAlt, FaSearch, FaClock, FaUserMd, FaLungs, FaPills, FaAppleAlt } from 'react-icons/fa';
import Sidebar from '../components/Layout/Sidebar';
import Navbar from '../components/Layout/Navbar';

const EducationalHub = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: FaBook },
    { id: 'triggers', name: 'Asthma Triggers', icon: FaLungs },
    { id: 'medication', name: 'Medication Use', icon: FaPills },
    { id: 'lifestyle', name: 'Lifestyle Tips', icon: FaAppleAlt },
    { id: 'clinical', name: 'Clinical Guidance', icon: FaUserMd }
  ];

  const articles = [
    {
      id: 1,
      title: 'Understanding Your Asthma Triggers',
      category: 'triggers',
      type: 'article',
      readTime: '5 min',
      content: 'Learn to identify and avoid common asthma triggers including pollen, dust mites, mold, pet dander, and air pollution.',
      image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=400',
      author: 'Dr. Sarah Johnson',
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'Proper Inhaler Technique',
      category: 'medication',
      type: 'video',
      duration: '3:45',
      content: 'Step-by-step guide on how to use your inhaler correctly for maximum effectiveness.',
      videoUrl: 'https://www.youtube.com/embed/demo',
      author: 'Respiratory Therapist',
      date: '2024-01-10'
    },
    {
      id: 3,
      title: 'Creating an Asthma Action Plan',
      category: 'clinical',
      type: 'article',
      readTime: '8 min',
      content: 'Work with your doctor to develop a personalized asthma action plan for better management.',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400',
      author: 'Dr. Alice Niyonzima',
      date: '2024-01-05'
    },
    {
      id: 4,
      title: 'Exercise and Asthma',
      category: 'lifestyle',
      type: 'article',
      readTime: '6 min',
      content: 'Tips for staying active while managing asthma symptoms effectively.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      author: 'Physical Therapist',
      date: '2024-01-01'
    },
    {
      id: 5,
      title: 'Environmental Control Measures',
      category: 'triggers',
      type: 'video',
      duration: '4:20',
      content: 'Learn how to reduce allergens and irritants in your home environment.',
      videoUrl: 'https://www.youtube.com/embed/demo2',
      author: 'Environmental Health Specialist',
      date: '2023-12-28'
    },
    {
      id: 6,
      title: 'Nutrition for Respiratory Health',
      category: 'lifestyle',
      type: 'article',
      readTime: '7 min',
      content: 'Discover foods that support lung health and reduce inflammation.',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
      author: 'Nutritionist',
      date: '2023-12-20'
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="0t22inhc flex h-screen bg-gray-100">
      <Sidebar />
      <div className="0ee0a64z flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="0fu62bgj flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="0dx4djxo max-w-7xl mx-auto">
            {/* Header */}
            <div className="0auuacox mb-8">
              <h1 className="0ypstgps text-3xl font-bold text-gray-800 mb-2">Educational Hub</h1>
              <p className="08u9drvj text-gray-600">Empower yourself with knowledge about asthma management</p>
            </div>

            {/* Search and Categories */}
            <div className="0j63mn7u mb-8">
              <div className="02n3dltd relative mb-6">
                <FaSearch className="03ykpgmk absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles and videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="0hgzbknh w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              
              <div className="0dpifx2d flex flex-wrap gap-3">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`0ge3khod flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <category.icon className="04x9vxtr text-sm" />
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Articles Grid */}
            <div className="0ha2rzky grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="0qdedvha bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {article.type === 'video' ? (
                    <div className="0otcsoa9 relative h-48 bg-gray-900 flex items-center justify-center">
                      <div className="06fhqtpe absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <FaVideo className="0yjkehn0 text-white text-5xl" />
                      </div>
                      <div className="0s9zjsyc absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        {article.duration}
                      </div>
                    </div>
                  ) : (
                    <img src={article.image} alt={article.title} className="0mis0de9 w-full h-48 object-cover" />
                  )}
                  
                  <div className="0jaflacx p-6">
                    <div className="0pox016l flex items-center justify-between mb-3">
                      <span className={`021dnbhs text-xs px-2 py-1 rounded ${
                        article.category === 'triggers' ? 'bg-yellow-100 text-yellow-800' :
                        article.category === 'medication' ? 'bg-green-100 text-green-800' :
                        article.category === 'lifestyle' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {categories.find(c => c.id === article.category)?.name}
                      </span>
                      <div className="02sqaqxy flex items-center text-gray-500 text-sm">
                        {article.type === 'video' ? (
                          <FaVideo className="01qg3px7 mr-1" />
                        ) : (
                          <FaFileAlt className="0i2dahko mr-1" />
                        )}
                        <span className="0bndmxzz capitalize">{article.type}</span>
                      </div>
                    </div>
                    
                    <h3 className="0pzb55t2 font-bold text-lg mb-2 line-clamp-2">{article.title}</h3>
                    <p className="009zb2lz text-gray-600 text-sm mb-4 line-clamp-2">{article.content}</p>
                    <div className="05ae42ex flex items-center justify-between text-sm text-gray-500">
                      <span>{article.readTime || article.duration} • {article.author}</span>
                      <span>{new Date(article.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {filteredArticles.length === 0 && (
              <div className="0nb2sgux text-center py-12">
                <FaSearch className="0kknlypb mx-auto text-4xl text-gray-400 mb-4" />
                <p className="0is2r7y3 text-xl text-gray-500">No articles found matching your search</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EducationalHub;
