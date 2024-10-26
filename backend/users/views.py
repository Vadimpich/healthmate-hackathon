from allauth.account.utils import send_email_confirmation
from django.contrib.auth import get_user_model, authenticate
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UserRegistrationSerializer, UserLoginSerializer, \
    UserProfileSerializer

User = get_user_model()


class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        send_email_confirmation(request, user)
        return Response(
            {"detail": "Пожалуйста, проверьте вашу почту для подтверждения."})


class UserLoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        else:
            return Response({'detail': 'Неправильный логин или пароль.'},
                            status=status.HTTP_401_UNAUTHORIZED)


class UserLogoutView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        token = request.data.get('refresh')
        if token is None:
            return Response({"detail": "Токен обновления не предоставлен."},
                            status=400)

        try:
            token_obj = OutstandingToken.objects.get(token=token)
            token_obj.blacklist()
            return Response({"detail": "Вы успешно вышли из системы."},
                            status=205)
        except OutstandingToken.DoesNotExist:
            return Response({"detail": "Токен не найден."}, status=404)


class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def patch(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)