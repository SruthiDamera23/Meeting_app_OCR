# Generated by Django 4.2.5 on 2024-03-20 00:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('church', '0001_initial'),
        ('quickstart', '0003_remove_user_is_admin_user_church_user_user_type'),
        ('tasks', '0006_task_meetings'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='church',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='taskchurch', to='church.church'),
        ),
        migrations.AddField(
            model_name='task',
            name='created_by',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='taskuser', to='quickstart.user'),
        ),
    ]
