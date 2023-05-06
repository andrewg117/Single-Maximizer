import '../css/sign_in_style.css'

function SignUp() {
  return (
    <>
      <section id="sign-in-content">
        <div id="block-left">
          <h1>Image</h1>
        </div>

        <div id="block-right">
          <h1>Sign Up</h1>

          <form id="signin-form" action="/content/profile_view.html">
            <div id="signin-form-div">
              <div id="f-lname-div">
                <div class="">
                  <label for="fname">FIRST NAME</label>
                  <input type="text" id="fname" name="firstname" />
                </div>
                <div class="">
                  <label for="lname">LAST NAME</label>
                  <input type="text" id="lname" name="lastname" />
                </div>
              </div>
              <label htmlFor="email">EMAIL</label>
              <input type="email" id="email" name="email" />
              <label htmlFor="uname">USERNAME</label>
              <input type="text" id="uname" name="username" />
              <label htmlFor="pword">PASSWORD</label>
              <input type="password" id="pword" name="password" />
              <div id="submit-div">
                <input type="submit" id="signin-submit" value="SUBMIT" />
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

export default SignUp