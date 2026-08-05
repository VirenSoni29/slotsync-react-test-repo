import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { registerBusiness } from '../../services/businessService';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { toast } from 'sonner';
import '../../css/create-business.css';

const CreateBusiness = () => {
   const { user, setUser } = useContext(AuthContext);
   const navigate = useNavigate();
   const [loading, setLoading] = useState(false);

   const [formData, setFormData] = useState({
      name: '',
      tagline: '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: '',
      category: 'General',
      website: '',
      slug: ''
   });

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
         ...prev,
         [name]: value,
         ...(name === 'name' && !prev.slug ? { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') } : {})
      }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.name.trim()) {
         toast.error('Business Name is required');
         return;
      }

      setLoading(true);
      try {
         const res = await registerBusiness(formData);
         toast.success(res.message || 'Business registered successfully!');
         
         if (res.data?.user) {
            setUser(res.data.user);
         } else if (user) {
            setUser({ ...user, role: 'business_owner' });
         }

         navigate('/business/dashboard');
      } catch (err) {
         toast.error(err.response?.data?.message || 'Failed to register business.');
      } finally {
         setLoading(false);
      }
   };

   return (
      <>
         <Navbar />
         <div className="create-business-container">
            <div className="create-business-card">
               <div className="cb-header">
                  <span className="cb-badge">
                     Partner With SlotSync
                  </span>
                  <h1 className="cb-title">Create Business Entry</h1>
                  <p className="cb-subtitle">
                     Setup your business entry to start offering services, managing slots, and receiving appointment bookings.
                  </p>
               </div>

               <form onSubmit={handleSubmit} className="cb-form">
                  <div className="cb-form-grid">
                     <div className="cb-field-group">
                        <label>Business Name <span className="required">*</span></label>
                        <input
                           type="text"
                           name="name"
                           required
                           value={formData.name}
                           onChange={handleChange}
                           maxLength={40}
                           placeholder="Apex Wellness Center"
                           className="cb-input"
                        />
                     </div>

                     <div className="cb-field-group">
                        <label>Business Slug (URL)</label>
                        <input
                           type="text"
                           name="slug"
                           value={formData.slug}
                           onChange={handleChange}
                           placeholder="apex-wellness"
                           className="cb-input"
                        />
                     </div>
                  </div>

                  <div className="cb-field-group">
                     <label>Tagline / Short Description</label>
                     <input
                        type="text"
                        name="tagline"
                        value={formData.tagline}
                        onChange={handleChange}
                        placeholder="Premium health and relaxation appointments"
                        className="cb-input"
                     />
                  </div>

                  <div className="cb-form-grid">
                     <div className="cb-field-group">
                        <label>Category</label>
                        <select
                           name="category"
                           value={formData.category}
                           onChange={handleChange}
                           className="cb-select"
                        >
                           <option value="Salon & Beauty">Salon & Beauty</option>
                           <option value="Healthcare & Medical">Healthcare & Medical</option>
                           <option value="Fitness & Wellness">Fitness & Wellness</option>
                           <option value="Consulting & Coaching">Consulting & Coaching</option>
                           <option value="Auto Services">Auto Services</option>
                           <option value="General">General</option>
                        </select>
                     </div>

                     <div className="cb-field-group">
                        <label>Contact Phone</label>
                        <input
                           type="text"
                           name="phone"
                           value={formData.phone}
                           onChange={handleChange}
                           maxLength={10}
                           inputMode='tel'
                           autoComplete='tel'
                           placeholder="+91 98765 43210"
                           className="cb-input"
                        />
                     </div>
                  </div>

                  <div className="cb-form-grid">
                     <div className="cb-field-group">
                        <label>Contact Email</label>
                        <input
                           type="email"
                           name="email"
                           value={formData.email}
                           onChange={handleChange}
                           maxLength={50}
                           inputMode='email'
                           autoComplete='work email'
                           placeholder="contact@apexwellness.com"
                           className="cb-input"
                        />
                     </div>

                     <div className="cb-field-group">
                        <label>Website URL</label>
                        <input
                           type="url"
                           name="website"
                           value={formData.website}
                           onChange={handleChange}
                           placeholder="https://apexwellness.com"
                           className="cb-input"
                        />
                     </div>
                  </div>

                  <div className="cb-field-group">
                     <label>Physical Address</label>
                     <textarea
                        name="address"
                        rows="3"
                        value={formData.address}
                        autoComplete='address'
                        onChange={handleChange}
                        placeholder="123 Health Ave, Suite 400, Financial District"
                        className="cb-textarea"
                     ></textarea>
                  </div>

                  <button
                     type="submit"
                     disabled={loading}
                     className="cb-submit-btn"
                  >
                     {loading ? 'Creating Business Entry...' : 'Launch Business Entry'}
                  </button>
               </form>
            </div>
         </div>
         <Footer />
      </>
   );
};

export default CreateBusiness;
