import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import '../css/profile_nav.css'
import '../css/profile_style.css'

function Profile() {
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user) {
      navigate('/home')
    }
  }, [user, navigate])

  return (
    <>
      <div id="content-right">
        <div id="profile-title">
          <h1>FMGMP3</h1>
        </div>
        <form id="profile-form" action="/content/profile_view.html">
          <div id="profile-form-div">
            <div className="input-div">
              <div>
                <label htmlFor="aname">ARTIST NAME</label>
                <input type="text" id="aname" name="artistname" placeholder="Enter your artist name" />
              </div>
              <div>
                <label htmlFor="email">EMAIL</label>
                <input type="email" id="email" name="email" placeholder="Enter your email address" />
              </div>
            </div>
            <div className="input-div">
              <div>
                <label htmlFor="website">WEBSITE</label>
                <input type="url" id="website" name="website" placeholder="Enter your website starting with http://" />
              </div>
              <div>
                <label htmlFor="scloud">SOUNDCLOUD</label>
                <input type="url" id="scloud" name="soundcloud" placeholder="Enter your soundcloud link" />
              </div>
            </div>
            <div className="input-div">
              <div>
                <label htmlFor="twitter">TWITTER</label>
                <input type="url" id="twitter" name="twitter" placeholder="Enter your twitter handle" />
              </div>
              <div>
                <label htmlFor="igram">INSTAGRAM</label>
                <input type="url" id="igram" name="instagram" placeholder="Enter your instagram username" />
              </div>
            </div>
            <div className="input-div">
              <div>
                <label htmlFor="fbook">FACEBOOK</label>
                <input type="url" id="fbook" name="facebook" placeholder="Enter your facebook handle" />
              </div>
              <div>
                <label htmlFor="spotify">SPOTIFY</label>
                <input type="url" id="spotify" name="spotify" placeholder="Enter your spotify URI" />
              </div>
            </div>
            <div className="input-div">
              <div>
                <label htmlFor="ytube">YOUTUBE</label>
                <input type="url" id="ytube" name="youtube" placeholder="Enter your youtube profile link" />
              </div>
              <div>
                <label htmlFor="tiktok">TIKTOK</label>
                <input type="url" id="tiktok" name="tiktok" placeholder="Enter your tiktok username" />
              </div>
            </div>
            <div className="input-div">
              <div>
                <label htmlFor="bio-text">BIO</label>
                <textarea name="" id="bio-text" cols="30" rows="10" placeholder="Enter your artist bio here"></textarea>
              </div>
            </div>
            <div id="submit-div">
              <input type="submit" className="profile-btn" value="SAVE" />
              <input type="submit" className="profile-btn" value="CANCEL" />
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default Profile