from RPi import GPIO
from config import (
    MotorLeft_A,
    MotorLeft_B,
    MotorRight_A,
    MotorRight_B,
    forward0,
    forward1,
    backward0,
    backward1,
    MotorLeft_PWM,
    MotorRight_PWM,
)
import time

# set GPIO warnings as flase
GPIO.setwarnings(False)

# set up GPIO mode as BOARD
GPIO.setmode(GPIO.BOARD)

GPIO.setup(MotorLeft_A, GPIO.OUT)
GPIO.setup(MotorLeft_B, GPIO.OUT)
GPIO.setup(MotorLeft_PWM, GPIO.OUT)

"""
모터와 라즈베리파이의 연결이 성립되면, 라즈베리파이의 GPI 핀들(MotorLeft_A, MotorLeft_B, and MotorLeft_PWM) 은
핀의 역할이 출력(output)인지, 혹은 입력(input)인지 여부를 명확하게 선언해야합니다.
"""
# =======================================================================
# because the connetions between motors (right motor) and Rapberry Pi has been
# established, the GPIO pins of Rapberry Pi
# such as MotorLeft_A, MotorLeft_B, and MotorLeft_PWM
# should be clearly declared whether their roles of pins
# are output pin or input pin
# =======================================================================

GPIO.setup(MotorRight_A, GPIO.OUT)
GPIO.setup(MotorRight_B, GPIO.OUT)
GPIO.setup(MotorRight_PWM, GPIO.OUT)

# =======================================================================
# create left pwm object to control the speed of left motor
# =======================================================================
LEFT_PWM = GPIO.PWM(MotorLeft_PWM, 100)

# =======================================================================
# create right pwm object to control the speed of right motor
# =======================================================================
RIGHT_PWM = GPIO.PWM(MotorRight_PWM, 100)

LEFT = True
RIGHT = not LEFT
FORWARD = True
BACKWARD = not FORWARD


def pwm_setup():
    LEFT_PWM.start(0)
    RIGHT_PWM.start(0)


def pwm_low():
    GPIO.output(MotorLeft_PWM, GPIO.LOW)
    GPIO.output(MotorRight_PWM, GPIO.LOW)
    LEFT_PWM.ChangeDutyCycle(0)
    RIGHT_PWM.ChangeDutyCycle(0)
    GPIO.cleanup()


def get_distance():
    GPIO.setmode(GPIO.BOARD)

    trig = 33
    echo = 31

    # ultrasonic sensor setting
    GPIO.setup(trig, GPIO.OUT)
    GPIO.setup(echo, GPIO.IN)

    GPIO.output(trig, False)
    time.sleep(0.5)
    GPIO.output(trig, True)
    time.sleep(0.00001)
    GPIO.output(trig, False)

    while GPIO.input(echo) == 0:
        pulse_start = time.time()

    while GPIO.input(echo) == 1:
        pulse_end = time.time()

    pulse_duration = pulse_end - pulse_start
    distance = pulse_duration * 17000
    distance = round(distance, 2)
    return distance


# chan_list = (11, 12)
# GPIO.output(chan_list, GPIO.LOW)  # all LOW
# GPIO.output(chan_list, (GPIO.HIGH, GPIO.LOW))  # first HIGH, second LOW


def stop():
    LEFT_PWM.ChangeDutyCycle(0)
    RIGHT_PWM.ChangeDutyCycle(0)


def move_wheel(is_left, is_forward, speed, duration=None):
    if is_left:
        if is_forward:
            GPIO.output(MotorLeft_A, GPIO.HIGH)
            GPIO.output(MotorLeft_B, GPIO.LOW)
        else:
            GPIO.output(MotorLeft_A, GPIO.LOW)
            GPIO.output(MotorLeft_B, GPIO.HIGH)
        LEFT_PWM.ChangeDutyCycle(speed)
    else:
        if is_forward:
            GPIO.output(MotorRight_A, GPIO.LOW)
            GPIO.output(MotorRight_B, GPIO.HIGH)
        else:
            GPIO.output(MotorRight_A, GPIO.HIGH)
            GPIO.output(MotorRight_B, GPIO.LOW)
        RIGHT_PWM.ChangeDutyCycle(speed)

    if isinstance(duration, int):
        time.sleep(duration)
        stop()


def _vertical_move(is_forward, speed, duration=None):
    move_wheel(LEFT, is_forward, speed, duration)
    move_wheel(RIGHT, is_forward, speed, duration)


def forward(speed, duration=None):
    _vertical_move('go', speed, duration)


def backward(speed, duration):
    _vertical_move('back', speed, duration)

