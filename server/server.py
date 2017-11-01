from flask import (
    Flask,
    request,
    render_template,
)
from car import move_wheel, stop

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret?zz'


@app.route('/action', methods=['POST'])
def action_controller():
    """
    left: 'left' or 'right
    """
    print(request.form)
    
    is_left = request.form['leftRight'] == 'left'
    is_forward = request.form['forwardBackward'] == 'forward'
    speed = float(request.form['speed'])
    _move_wheel(is_left, is_forward, speed, None)
    return 'OK'

@app.route('/stop', methods=['POST'])
def stop_controller():
    stop()
    return 'OK'

if __name__ == "__main__":
    app.debug = True
    app.run('0.0.0.0', port=5000)
