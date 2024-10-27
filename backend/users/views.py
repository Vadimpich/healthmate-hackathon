from allauth.account.models import EmailAddress
from allauth.account.utils import send_email_confirmation
from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer,
    UserProfileSerializer
)

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
        username_or_email = request.data.get('username')
        password = request.data.get('password')

        user = User.objects.filter(username=username_or_email).first()
        if not user:
            user = User.objects.filter(email=username_or_email).first()

        if user is not None and user.check_password(password):
            if not EmailAddress.objects.filter(user=user,
                                               verified=True).exists():
                return Response(
                    {'detail': 'Пожалуйста, подтвердите свою почту.'},
                    status=status.HTTP_403_FORBIDDEN)
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Неправильный логин или пароль.'},
                            status=status.HTTP_401_UNAUTHORIZED)


class UserLogoutView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Получаем refresh-токен из тела запроса
        refresh_token = request.data.get('refresh')
        if refresh_token is None:
            return Response({"detail": "Токен обновления не предоставлен."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            # Блокируем токен, добавляя его в черный список
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Вы успешно вышли из системы."},
                            status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({
                "detail": "Невозможно выйти из системы. "
                          "Токен недействителен или отсутствует."
            },
                status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def patch(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data,
                                         partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)
